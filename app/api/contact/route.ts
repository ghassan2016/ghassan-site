import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limit per IP (resets on cold start).
// For production scale, swap for Upstash Redis or Vercel KV.
const HITS = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

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

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const honeypot = String(body.company ?? "").trim(); // bot trap

  if (honeypot) return NextResponse.json({ ok: true }); // silently drop bots

  if (!name || name.length < 2)
    return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  if (!isEmail(email))
    return NextResponse.json({ ok: false, error: "Valid email is required." }, { status: 400 });
  if (!message || message.length < 10)
    return NextResponse.json(
      { ok: false, error: "Message must be at least 10 characters." },
      { status: 400 }
    );

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "gssan1018@gmail.com";

  // Provider 1: Formspree (preferred, simplest)
  if (formspreeId) {
    const r = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, message, _subject: `New message from ${name}` }),
    });
    if (!r.ok) {
      return NextResponse.json(
        { ok: false, error: "Mail provider error." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  }

  // Provider 2: Resend (transactional)
  if (resendKey) {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: email,
        subject: `New message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });
    if (!r.ok) {
      return NextResponse.json(
        { ok: false, error: "Mail provider error." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  }

  // Fallback: no provider configured — return a helpful error
  return NextResponse.json(
    {
      ok: false,
      error:
        "Contact form is not yet configured. Please email gssan1018@gmail.com directly.",
    },
    { status: 503 }
  );
}
