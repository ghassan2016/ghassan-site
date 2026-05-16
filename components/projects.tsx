import { Section } from "./section";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <Section
      id="work"
      eyebrow="Selected Work"
      title="Platforms used at national scale"
      description="A selection of production systems — government portals, human-rights platforms, and bilingual marketplaces. All built with Laravel + MySQL, deployed end-to-end."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2">
        {projects.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col bg-[var(--color-surface)] p-7 transition-colors hover:bg-[var(--color-surface-2)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">
                  {p.name}
                </h3>
                <div className="mt-1 text-sm text-[var(--color-muted)]">
                  {p.tagline}
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
                {p.status}
              </span>
            </div>

            <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
              {p.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-subtle)]"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-1.5 text-xs text-[var(--color-muted)] group-hover:text-[var(--color-accent)]">
              <span className="link-underline">Visit project</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}
