"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";

type Role = "user" | "model";
interface Msg {
  role: Role;
  text: string;
}

const SUGGESTIONS = [
  "What kind of work are you available for?",
  "Tell me about ArabTalents.",
  "What's your strongest tech stack?",
  "How do I hire you?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "model",
          text: `Hi — I'm a digital version of Ghassan. Ask me about my work, stack, projects, or how to hire me. For anything serious, drop me a real email at ${profile.email}.`,
        },
      ]);
    }
  }, [open, messages.length]);

  // Auto-scroll to bottom on new content
  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streaming]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError(null);
    const newMessages: Msg[] = [
      ...messages,
      { role: "user", text: trimmed },
      { role: "model", text: "" },
    ];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages, // prior turns only (excludes the empty model slot)
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          let event: { delta?: string; done?: boolean; error?: string };
          try {
            event = JSON.parse(line);
          } catch {
            continue;
          }
          if (event.error) throw new Error(event.error);
          if (event.delta) {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last && last.role === "model") {
                next[next.length - 1] = { role: "model", text: last.text + event.delta };
              }
              return next;
            });
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      if (msg.includes("aborted")) return;
      setError(msg);
      setMessages((prev) => prev.slice(0, -1)); // remove the empty model slot
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }

  return (
    <>
      {/* Launcher */}
      <button
        aria-label={open ? "Close chat" : "Chat with Digital Ghassan"}
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-fg)] text-[var(--color-bg)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform hover:scale-105 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 ${
          open ? "rotate-45" : ""
        }`}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {/* Panel */}
      <div
        className={`fixed bottom-20 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] transition-all duration-300 sm:bottom-24 sm:right-6 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ height: "min(580px, calc(100vh - 7rem))" }}
        role="dialog"
        aria-label="Chat with Digital Ghassan"
        aria-modal={open}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-fg)] text-xs font-semibold text-[var(--color-bg)]">
                G
              </span>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-surface-2)] bg-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--color-fg)]">
                Digital Ghassan
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-subtle)]">
                AI · powered by Gemini
              </div>
            </div>
          </div>
          <button
            aria-label="Reset conversation"
            onClick={reset}
            className="rounded-md p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-bg)] hover:text-[var(--color-fg)]"
            title="New conversation"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollerRef}
          className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        >
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} text={m.text} streaming={streaming && i === messages.length - 1 && m.role === "model"} />
          ))}

          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}

          {messages.length <= 1 && !streaming && (
            <div className="flex flex-col gap-1.5 pt-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]/50 px-3 py-2 text-left text-xs text-[var(--color-muted)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg)] hover:text-[var(--color-fg)]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
          <div className="flex items-end gap-2 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3 py-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask Ghassan anything…"
              rows={1}
              maxLength={1500}
              disabled={streaming}
              className="flex-1 resize-none bg-transparent text-sm text-[var(--color-fg)] placeholder:text-[var(--color-subtle)] focus:outline-none disabled:opacity-50"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || streaming}
              aria-label="Send message"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-fg)] text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="mt-1.5 px-1 text-[10px] text-[var(--color-subtle)]">
            AI replies. For anything serious, email {profile.email}.
          </div>
        </div>
      </div>
    </>
  );
}

function Bubble({
  role,
  text,
  streaming,
}: {
  role: Role;
  text: string;
  streaming: boolean;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
          isUser
            ? "bg-[var(--color-fg)] text-[var(--color-bg)]"
            : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)]"
        }`}
      >
        {text}
        {streaming && !text && (
          <span className="inline-flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted)]" style={{ animationDelay: "0ms" }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted)]" style={{ animationDelay: "150ms" }} />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-muted)]" style={{ animationDelay: "300ms" }} />
          </span>
        )}
        {streaming && text && (
          <span className="ml-0.5 inline-block h-3 w-[2px] animate-pulse bg-current align-middle" />
        )}
      </div>
    </div>
  );
}
