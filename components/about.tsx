import { capabilities, profile } from "@/lib/data";
import { delay } from "@/lib/style";
import { Section } from "./section";
import { LocalTime } from "./local-time";

const icons = [
  // product — stacked layers
  <path key="p" d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5" />,
  // systems — database
  <path key="s" d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zm0 0v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />,
  // interfaces — window
  <path key="i" d="M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01" />,
  // bilingual — globe
  <path key="b" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />,
];

export function About() {
  return (
    <Section
      id="about"
      index="03"
      eyebrow="About"
      title={
        <>
          An engineer who owns <em>the whole problem.</em>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div
          data-reveal
          className="rounded-3xl border border-white/[0.07] bg-[var(--color-surface)] p-8 sm:p-10 lg:col-span-2"
        >
          <p className="text-pretty text-2xl font-medium leading-snug tracking-[-0.02em] text-[var(--color-fg)] sm:text-[1.75rem]">
            I started in 2020 shipping platforms for Palestinian government bodies, human-rights
            organisations and Gulf clients.{" "}
            <span className="text-[var(--color-muted)]">
              Since then I&apos;ve owned systems end-to-end — data models, APIs, access control,
              real-time pipelines, and the interfaces on top.
            </span>
          </p>
          <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-[var(--color-muted)]">
            I&apos;m a software engineer, not a framework specialist. I pick the stack that fits the
            problem, and I obsess over the details people actually feel: speed, clarity, and Arabic
            that reads like Arabic — not a mirrored English layout.
          </p>
        </div>

        <div
          data-reveal
          style={delay(100)}
          className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[var(--color-surface)] p-8"
        >
          {/* radar rings */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56" aria-hidden>
            {[0, 1, 2, 3].map((r) => (
              <span
                key={r}
                className="absolute inset-0 rounded-full border border-[#4fd1e8]/20"
                style={{ transform: `scale(${1 - r * 0.22})` }}
              />
            ))}
            <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent-2)] shadow-[0_0_24px_6px_rgba(79,209,232,0.5)]" />
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Based in
          </div>
          <div className="mt-2 text-xl font-semibold text-[var(--color-fg)]">{profile.shortLocation}</div>
          <LocalTime className="mt-10 block font-mono text-6xl font-medium tabular-nums tracking-[-0.04em] text-[var(--color-fg)]" />
          <div className="mt-3 text-sm text-[var(--color-muted)]">
            Local time · overlaps EU &amp; Gulf working hours
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {profile.availability}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <div
              key={c.title}
              data-reveal
              style={delay(i * 80)}
              className="group rounded-3xl border border-white/[0.07] bg-[var(--color-surface)] p-7 transition-colors hover:border-white/[0.14]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--color-accent)] transition-colors group-hover:text-[var(--color-accent-2)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {icons[i]}
                </svg>
              </span>
              <h3 className="mt-6 text-lg font-semibold tracking-[-0.015em] text-[var(--color-fg)]">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
