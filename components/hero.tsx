import { profile, stats } from "@/lib/data";
import { Portrait } from "./portrait";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="hero-glow absolute inset-0 -z-10" />
      <div className="grid-bg absolute inset-0 -z-10" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          {/* LEFT — copy */}
          <div className="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)]/60 px-3 py-1 text-xs text-[var(--color-muted)] backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {profile.availability}
            </div>

            <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-6xl lg:text-[64px] lg:leading-[1.05]">
              {profile.name}
              <span className="block text-[var(--color-muted)] font-normal">
                {profile.role}
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-[var(--color-muted)] sm:text-xl">
              {profile.heroLine}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-fg)] px-5 py-2.5 text-sm font-medium text-[var(--color-bg)] transition-transform hover:scale-[1.02]"
              >
                View selected work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:bg-[var(--color-surface-2)]"
              >
                Get in touch
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-2 py-2.5 text-sm text-[var(--color-muted)] link-underline hover:text-[var(--color-fg)]"
              >
                Download CV
              </a>
            </div>

            <dl className="mt-14 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:max-w-xl">
              {stats.map((s) => (
                <div key={s.label} className="bg-[var(--color-surface)] p-5">
                  <dt className="text-xs uppercase tracking-wider text-[var(--color-subtle)]">
                    {s.label}
                  </dt>
                  <dd className="mt-2 text-2xl font-semibold text-[var(--color-fg)]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* RIGHT — portrait */}
          <div className="fade-up relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative">
              {/* soft accent glow behind the portrait */}
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-[var(--color-accent)]/20 via-transparent to-transparent blur-3xl" />

              {/* portrait card (with built-in fallback) */}
              <Portrait />

              {/* corner badge */}
              <div className="absolute -bottom-3 -left-3 flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-muted)] shadow-lg">
                <span className="font-mono uppercase tracking-wider text-[var(--color-accent)]">
                  Gaza
                </span>
                <span className="h-3 w-px bg-[var(--color-border-strong)]" />
                <span>{profile.location.split(",").slice(-1)[0].trim()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
