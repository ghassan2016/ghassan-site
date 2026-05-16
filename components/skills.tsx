import { Section } from "./section";
import { skills, education, certifications, languages } from "@/lib/data";

export function Skills() {
  return (
    <Section
      id="stack"
      eyebrow="Stack"
      title="Tools I reach for"
      description="Backend-heavy with a strong frontend foundation. Optimized for production reliability, secure delivery, and bilingual (Arabic/English RTL) systems."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2">
        {Object.entries(skills).map(([group, items]) => (
          <div key={group} className="bg-[var(--color-surface)] p-7">
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {group}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {items.map((s) => (
                <span
                  key={s}
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-2.5 py-1 text-xs text-[var(--color-fg)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-px grid gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3">
        <div className="bg-[var(--color-surface)] p-7">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Education
          </div>
          <h3 className="mt-3 text-sm font-semibold text-[var(--color-fg)]">
            {education.degree}
          </h3>
          <div className="mt-1 text-sm text-[var(--color-muted)]">
            {education.institution}
          </div>
          <div className="mt-1 font-mono text-xs text-[var(--color-subtle)]">
            {education.year} · GPA {education.gpa}
          </div>
        </div>

        <div className="bg-[var(--color-surface)] p-7 md:col-span-2">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            Certifications
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {certifications.map((c) => (
              <li
                key={c.name}
                className="flex items-baseline gap-2 text-sm text-[var(--color-muted)]"
              >
                <span className="text-[var(--color-fg)]">{c.name}</span>
                <span className="truncate text-xs text-[var(--color-subtle)]">
                  · {c.issuer}
                  {"year" in c && c.year ? ` · ${c.year}` : ""}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-4 border-t border-[var(--color-border)] pt-4">
            {languages.map((l) => (
              <div key={l.name} className="text-xs">
                <span className="text-[var(--color-fg)]">{l.name}</span>{" "}
                <span className="text-[var(--color-subtle)]">— {l.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
