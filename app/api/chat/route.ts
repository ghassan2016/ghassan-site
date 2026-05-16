import { NextRequest, NextResponse } from "next/server";
import { streamChat, type ChatTurnIn } from "@/lib/gemini.server";

// Node runtime is required — the vendored gemini-reversed package uses
// `fs`, `crypto`, and other Node built-ins that don't exist on Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple per-IP rate limit (resets on cold start). For production scale
// swap for Upstash Redis or Vercel KV.
const HITS = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = HITS.get(ip);
  if (!entry || now > entry.resetAt) {
    HITS.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count += 1;
  return true;
}

const MAX_MESSAGE_LEN = 1500;
const MAX_HISTORY_TURNS = 12;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Slow down a moment." },
      { status: 429 }
    );
  }

  let body: { message?: string; history?: ChatTurnIn[]; useGem?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const message = String(body.message ?? "").trim();
  if (!message) {
    return NextResponse.json(
      { ok: false, error: "Message is required." },
      { status: 400 }
    );
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json(
      { ok: false, error: `Message too long (max ${MAX_MESSAGE_LEN} chars).` },
      { status: 400 }
    );
  }

  const history: ChatTurnIn[] = Array.isArray(body.history)
    ? body.history
        .filter(
          (t): t is ChatTurnIn =>
            !!t &&
            (t.role === "user" || t.role === "model") &&
            typeof t.text === "string" &&
            t.text.length > 0 &&
            t.text.length < MAX_MESSAGE_LEN
        )
        .slice(-MAX_HISTORY_TURNS)
    : [];

  // Pre-flight the generator so initialization errors surface BEFORE we open
  // the stream (so the client gets a real 500 + error JSON, not an empty
  // chunked response). Once the first delta succeeds we stream the rest.
  let generator: AsyncGenerator<string, void, unknown>;
  let firstChunk: IteratorResult<string, void>;
  try {
    generator = streamChat(message, history, body.useGem !== false);
    firstChunk = await generator.next();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    const stack = err instanceof Error ? err.stack : undefined;
    console.error("[chat] init error:", msg);
    if (stack) console.error(stack);
    return NextResponse.json(
      {
        ok: false,
        error: msg,
        hint:
          process.env.NODE_ENV !== "production"
            ? "Check the dev server console for the full stack trace. Common causes: missing GEMINI_SECURE_1PSID, expired __Secure-1PSID cookie, or account flagged."
            : undefined,
      },
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const write = (obj: object) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        if (!firstChunk.done && firstChunk.value) {
          write({ delta: firstChunk.value });
        }
        for await (const delta of generator) {
          write({ delta });
        }
        write({ done: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Internal error";
        console.error("[chat] stream error:", msg);
        write({ error: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
