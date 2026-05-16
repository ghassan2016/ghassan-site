// Server-side wrapper around the vendored gemini-reversed client.
// Initializes AuthGemini ONCE, manages the "Digital Ghassan" gem, and
// exposes a single `streamChat` function for the API route.
//
// SECURITY:
//   - Cookies live in env vars (GEMINI_SECURE_1PSID, GEMINI_SECURE_1PSIDTS).
//     They are NEVER sent to the browser.
//   - All Gemini calls happen server-side. The browser only sees the
//     streamed text response.
//   - Set CHAT_ENABLED=false to instantly disable the chat (e.g. if the
//     account hits a limit or you suspect cookie leak).

import path from "path";
import {
  DIGITAL_GHASSAN_DESCRIPTION,
  DIGITAL_GHASSAN_GEM_NAME,
  DIGITAL_GHASSAN_SYSTEM_PROMPT,
} from "./digital-ghassan-persona";

// We use eval('require') so webpack/turbopack CANNOT see this as a static
// import and try to bundle the vendored CJS package. The package has dozens
// of internal require() calls and uses Node built-ins (fs, crypto) — only
// Node's runtime resolver handles it correctly. Absolute path = no CWD
// surprises during build/dev.
type GeminiNS = {
  AuthGemini: new (opts: Record<string, unknown>) => GeminiClient;
  Gem: new (opts: { id: string; name: string; prompt?: string; predefined?: boolean }) => GemRef;
  Models: Record<string, unknown>;
};

function loadGemini(): GeminiNS {
  const abs = path.resolve(process.cwd(), "lib/gemini-reversed/index.js");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dynRequire = eval("require") as (id: string) => any;
  return dynRequire(abs);
}

interface GemRef {
  id: string;
  name: string;
}

interface ChatSession {
  cid: string;
  sendMessageStream: (
    prompt: string,
    options?: Record<string, unknown>
  ) => AsyncIterable<{ textDelta: string; text: string }>;
}

interface GeminiClient {
  init(): Promise<void>;
  close(): Promise<void>;
  fetchGems(): Promise<{
    values(): GemRef[];
    get(args: { name: string }): GemRef | null;
  }>;
  createGem(name: string, prompt: string, description?: string): Promise<GemRef>;
  startChat(opts?: { gem?: GemRef; model?: unknown }): ChatSession;
}

let _clientPromise: Promise<GeminiClient> | null = null;
let _gemPromise: Promise<GemRef> | null = null;

function getCookieConfig(): { secure1psid: string; secure1psidts: string } {
  const psid = process.env.GEMINI_SECURE_1PSID;
  const psidts = process.env.GEMINI_SECURE_1PSIDTS;
  if (!psid) {
    throw new Error(
      "GEMINI_SECURE_1PSID env var is not set. See README — Configure the chat."
    );
  }
  return {
    secure1psid: psid,
    secure1psidts: psidts ?? "",
  };
}

async function getClient(): Promise<GeminiClient> {
  if (!_clientPromise) {
    _clientPromise = (async () => {
      const { secure1psid, secure1psidts } = getCookieConfig();
      const gemini = loadGemini();
      const client = new gemini.AuthGemini({
        secure1psid,
        secure1psidts,
        verbose: process.env.NODE_ENV !== "production",
      });
      await client.init();
      return client;
    })().catch((err) => {
      _clientPromise = null; // allow retry on next request
      throw err;
    });
  }
  return _clientPromise;
}

// Ensures the "Digital Ghassan" gem exists. If a custom gem with that name
// is already on the account, reuse it. Otherwise create it once and cache
// the reference for the lifetime of this process.
async function getDigitalGhassanGem(): Promise<GemRef> {
  if (!_gemPromise) {
    _gemPromise = (async () => {
      const client = await getClient();
      try {
        const jar = await client.fetchGems();
        const existing = jar.get({ name: DIGITAL_GHASSAN_GEM_NAME });
        if (existing) return existing;
      } catch (err) {
        console.warn(
          "[gemini] fetchGems failed, will try createGem directly:",
          err instanceof Error ? err.message : err
        );
      }
      return client.createGem(
        DIGITAL_GHASSAN_GEM_NAME,
        DIGITAL_GHASSAN_SYSTEM_PROMPT,
        DIGITAL_GHASSAN_DESCRIPTION
      );
    })().catch((err) => {
      _gemPromise = null;
      throw err;
    });
  }
  return _gemPromise;
}

export interface ChatTurnIn {
  role: "user" | "model";
  text: string;
}

/**
 * Stream a Digital Ghassan response. Each yielded string is a delta to
 * append to the running response on the client.
 *
 * @param userMessage Latest user message.
 * @param history    Optional prior turns.
 * @param useGem     If false, falls back to inlining the system prompt into
 *                   the message (no gem call needed). Useful when the gem
 *                   API is rejecting the account.
 */
export async function* streamChat(
  userMessage: string,
  history: ChatTurnIn[] = [],
  useGem: boolean = true
): AsyncGenerator<string, void, unknown> {
  if (process.env.CHAT_ENABLED === "false") {
    throw new Error("Chat is temporarily disabled.");
  }

  const client = await getClient();

  let gem: GemRef | undefined = undefined;
  if (useGem) {
    try {
      gem = await getDigitalGhassanGem();
    } catch (err) {
      console.warn(
        "[gemini] gem path unavailable, falling back to inline system prompt:",
        err instanceof Error ? err.message : err
      );
      gem = undefined;
    }
  }

  // Compose a single prompt. With a gem, the persona is provided server-side;
  // without one, we inline it as a system preamble.
  const recap =
    history.length > 0
      ? history
          .slice(-6)
          .map((t) => `${t.role === "user" ? "Visitor" : "Ghassan"}: ${t.text}`)
          .join("\n\n") + "\n\n"
      : "";

  const prompt = gem
    ? `${recap}Visitor: ${userMessage}`
    : `${DIGITAL_GHASSAN_SYSTEM_PROMPT}\n\n---\n\n${recap}Visitor: ${userMessage}\n\nGhassan:`;

  const chat = client.startChat(gem ? { gem } : {});
  for await (const chunk of chat.sendMessageStream(prompt)) {
    if (chunk.textDelta) yield chunk.textDelta;
  }
}
