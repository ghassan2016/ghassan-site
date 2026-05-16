import { Section } from "./section";
import { currentWork } from "@/lib/data";

export function About() {
  return (
    <Section
      id="about"
      eyebrow="Now"
      title="What I'm shipping right now"
      description="Lead backend engineer at TAQAT Palestine Business Incubator. Owning systems end-to-end — schema design, RBAC, real-time pipelines, integrations, and deployment — for products used at national scale."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
        {currentWork.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="group bg-[var(--color-surface)] p-6 transition-colors hover:bg-[var(--color-surface-2)]"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-[var(--color-fg)]">
                {item.name}
              </h3>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--color-subtle)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--color-fg)]"
              >
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </div>
            <div className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--color-accent)]">
              {item.role}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
              {item.note}
            </p>
          </a>
        ))}
      </div>
    </Section>
  );
}
