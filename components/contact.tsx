"use client";

import { useState } from "react";
import { profile } from "@/lib/data";
import { LocalTime } from "./local-time";

type Status = "idle" | "loading" | "success" | "error";

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "WhatsApp", value: profile.phone, href: profile.whatsapp },
  { label: "LinkedIn", value: "in/ghassan-ahmed", href: profile.linkedin },
  { label: "Résumé", value: "View online or download PDF", href: "/cv" },
];

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      company: formData.get("company"), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Network error.");
    }
  }

  return (
    <section id="contact" className="relative isolate overflow-hidden py-24 lg:py-36">
      <div className="aurora -z-10 opacity-60" aria-hidden>
        <span className="a1" style={{ top: "auto", bottom: "-24rem" }} />
        <span className="a2" style={{ top: "auto", bottom: "-18rem" }} />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div data-reveal className="mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            <span className="text-[var(--color-accent)]">08</span>
            <span className="h-px w-8 bg-[var(--color-border-strong)]" />
            <span>Contact</span>
          </div>
          <h2 className="serif-em mt-6 text-balance text-[clamp(2.9rem,8.5vw,6.75rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[var(--color-fg)]">
            Let&apos;s build something <em>worth using.</em>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-[var(--color-muted)]">
            Open to senior engineering roles, product partnerships, and ambitious builds —
            remote-first. A short note about what you&apos;re building is the fastest way in.
          </p>

          <div className="mt-10 inline-flex max-w-full items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur">
            <a
              href={`mailto:${profile.email}`}
              className="truncate px-4 text-base font-medium text-[var(--color-fg)] sm:px-5 sm:text-lg"
            >
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="shrink-0 rounded-full bg-[var(--color-fg)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition-transform hover:scale-[1.03]"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-20 grid gap-4 lg:grid-cols-5">
          <aside
            data-reveal
            className="flex flex-col rounded-3xl border border-white/[0.07] bg-[#0c0c11]/90 p-3 backdrop-blur lg:col-span-2"
          >
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") || c.href.endsWith(".pdf") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl px-4 py-4 transition-colors hover:bg-white/[0.04]"
              >
                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">
                    {c.label}
                  </div>
                  <div className="mt-1 truncate text-[15px] text-[var(--color-fg)]">{c.value}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[var(--color-subtle)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-fg)]" aria-hidden>
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
            ))}
            <div className="mt-auto flex items-center justify-between gap-4 rounded-2xl border-t border-white/[0.06] px-4 pb-2 pt-5">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">
                  Based in
                </div>
                <div className="mt-1 text-[15px] text-[var(--color-muted)]">{profile.location}</div>
              </div>
              <LocalTime className="font-mono text-2xl tabular-nums text-[var(--color-fg)]" />
            </div>
          </aside>

          <form
            data-reveal
            onSubmit={onSubmit}
            className="rounded-3xl border border-white/[0.07] bg-[#0c0c11]/90 p-7 backdrop-blur sm:p-8 lg:col-span-3"
          >
            {/* Honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" required placeholder="Your name" autoComplete="name" />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="message"
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                minLength={10}
                rows={6}
                placeholder="What are you building?"
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-[var(--color-bg)] px-4 py-3 text-[15px] text-[var(--color-fg)] placeholder:text-[var(--color-subtle)] transition-colors focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="min-h-[1.25rem] text-sm" aria-live="polite">
                {status === "success" && (
                  <span className="text-emerald-400">Message sent. I&apos;ll get back within 24h.</span>
                )}
                {status === "error" && <span className="text-rose-400">{error}</span>}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-fg)] px-6 py-3 text-sm font-medium text-[var(--color-bg)] transition-transform hover:scale-[1.03] disabled:opacity-50"
              >
                {status === "loading" ? "Sending…" : "Send message"}
                {status !== "loading" && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-[var(--color-bg)] px-4 py-3 text-[15px] text-[var(--color-fg)] placeholder:text-[var(--color-subtle)] transition-colors focus:border-[var(--color-accent)] focus:outline-none"
      />
    </div>
  );
}
