"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/data";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the link for whichever section sits in the middle of the viewport.
  useEffect(() => {
    const sections = nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:pt-4">
      <nav
        className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border px-2 transition-all duration-500 ${
          scrolled || open
            ? "border-white/10 bg-[#0b0b10]/75 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border-transparent"
        }`}
      >
        <a
          href="#top"
          className="flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3"
          aria-label={`${profile.name} — back to top`}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[conic-gradient(from_200deg,#8b7bff,#4fd1e8,#8b7bff)] p-px">
            <span className="grid h-full w-full place-items-center rounded-full bg-[var(--color-bg)] font-serif text-lg italic leading-none text-[var(--color-fg)]">
              g
            </span>
          </span>
          <span className="text-sm font-semibold tracking-tight">{profile.name}</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active === item.href
                    ? "bg-white/[0.07] text-[var(--color-fg)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-fg)]"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden rounded-full bg-[var(--color-fg)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            Let&apos;s talk
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[var(--color-fg)] lg:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b10]/90 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base text-[var(--color-muted)] hover:bg-white/[0.05] hover:text-[var(--color-fg)]"
                >
                  {item.label}
                  <span aria-hidden className="text-[var(--color-subtle)]">→</span>
                </a>
              </li>
            ))}
            <li className="p-2">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-[var(--color-fg)] px-4 py-3 text-center text-sm font-medium text-[var(--color-bg)]"
              >
                Let&apos;s talk
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
