import { projects } from "@/lib/data";
import { delay } from "@/lib/style";
import { Section } from "./section";
import { SpotlightGrid } from "./spotlight";

const host = (href: string) => new URL(href).hostname.replace(/^www\./, "");

export function Projects() {
  return (
    <Section
      id="work"
      index="04"
      eyebrow="Selected work"
      title={
        <>
          Platforms trusted at <em>national scale.</em>
        </>
      }
      description="Government portals, human-rights platforms, and bilingual marketplaces — production systems people depend on every day."
    >
      <SpotlightGrid className="grid gap-4 sm:grid-cols-2">
        {projects.map((p, i) => (
          <div key={p.name} data-reveal style={delay((i % 2) * 90)}>
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              data-spot
              className="spotlight group flex h-full flex-col rounded-3xl border border-white/[0.07] bg-[var(--color-surface)] p-7 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--color-subtle)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                    p.status === "Government"
                      ? "bg-[#4fd1e8]/10 text-[#8fe6f3]"
                      : "bg-emerald-400/10 text-emerald-300"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <h3 className="mt-10 text-2xl font-semibold tracking-[-0.025em] text-[var(--color-fg)]">
                {p.name}
              </h3>
              <div className="mt-1 text-sm text-[#b3a9ff]">{p.tagline}</div>

              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[var(--color-muted)]">
                {p.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-0.5 text-[11px] text-[var(--color-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-white/[0.06] pt-5">
                <span className="font-mono text-xs text-[var(--color-subtle)] transition-colors group-hover:text-[var(--color-fg)]">
                  {host(p.href)}
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-[var(--color-muted)] transition-all duration-300 group-hover:border-transparent group-hover:bg-[var(--color-fg)] group-hover:text-[var(--color-bg)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform duration-300 group-hover:rotate-45" aria-hidden>
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </span>
              </div>
            </a>
          </div>
        ))}
      </SpotlightGrid>
    </Section>
  );
}
