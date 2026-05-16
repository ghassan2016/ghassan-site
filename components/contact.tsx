"use client";

import { useState } from "react";
import { Section } from "./section";
import { profile } from "@/lib/data";

type Status = "idle" | "loading" | "success" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const formData = new FormData(e.currentTarget);
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
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Network error.");
    }
  }

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something serious"
      description="Open to senior backend, lead engineer, and engineering partner roles — remote-first. The fastest path is a short note about what you're building."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] lg:grid-cols-5">
        {/* Side panel */}
        <aside className="bg-[var(--color-surface)] p-7 lg:col-span-2">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Direct
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="mt-3 block break-all text-base font-medium text-[var(--color-fg)] link-underline"
          >
            {profile.email}
          </a>

          <div className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Phone / WhatsApp
          </div>
          <div className="mt-2 text-sm text-[var(--color-muted)]">
            {profile.phone}
          </div>

          <div className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            LinkedIn
          </div>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-[var(--color-fg)] link-underline"
          >
            ghassan-ahmed
          </a>

          <div className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Based in
          </div>
          <div className="mt-2 text-sm text-[var(--color-muted)]">
            {profile.location}
          </div>
        </aside>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="bg-[var(--color-surface)] p-7 lg:col-span-3"
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
            <Field label="Name" name="name" required placeholder="Your name" />
            <Field
              label="Email"
              name="email"
              type="email"
              required
              placeholder="you@company.com"
            />
          </div>

          <div className="mt-5">
            <label className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Message
            </label>
            <textarea
              name="message"
              required
              minLength={10}
              rows={5}
              placeholder="What are you building?"
              className="mt-2 w-full resize-none rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-subtle)] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="min-h-[1.25rem] text-xs">
              {status === "success" && (
                <span className="text-emerald-400">
                  Message sent. I'll get back within 24h.
                </span>
              )}
              {status === "error" && (
                <span className="text-rose-400">{error}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-fg)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send message"}
              {status !== "loading" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-subtle)] focus:border-[var(--color-accent)] focus:outline-none"
      />
    </div>
  );
}
