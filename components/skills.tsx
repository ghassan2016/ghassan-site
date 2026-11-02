import { skills, education, certifications, languages } from "@/lib/data";
import { delay } from "@/lib/style";
import { Section } from "./section";

export function Skills() {
  return (
    <Section
      id="stack"
      index="07"
      eyebrow="Stack"
      title={
        <>
          The right tool <em>for every layer.</em>
        </>
      }
      description="Framework-agnostic by design: modern TypeScript and React on the front, solid APIs and data underneath, and bilingual (Arabic/English) delivery baked in."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((g, i) => (
          <div
            key={g.group}
            data-reveal
            style={delay((i % 3) * 80)}
            className="rounded-3xl border border-white/[0.07] bg-[var(--color-surface)] p-7"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#b3a9ff]">{g.group}</h3>
              <span className="font-mono text-xs text-[var(--color-subtle)]">
                {String(g.items.length).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-1 text-[13px] text-[var(--color-fg)] transition-colors hover:border-[#8b7bff]/60 hover:bg-[#8b7bff]/10"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}

        <div
          data-reveal
          style={delay(160)}
          className="rounded-3xl border border-white/[0.07] bg-gradient-to-br from-[#8b7bff]/[0.08] via-[var(--color-surface)] to-[var(--color-surface)] p-7"
        >
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[#b3a9ff]">Education</h3>
          <div className="mt-5 text-base font-semibold text-[var(--color-fg)]">{education.degree}</div>
          <div className="mt-1 text-sm text-[var(--color-muted)]">{education.institution}</div>
          <div className="mt-1 font-mono text-xs text-[var(--color-subtle)]">
            {education.year} · GPA {education.gpa}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-t border-white/[0.07] pt-5 text-sm">
            {languages.map((l) => (
              <div key={l.name}>
                <span className="text-[var(--color-fg)]">{l.name}</span>{" "}
                <span className="text-[var(--color-subtle)]">· {l.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        data-reveal
        className="mt-4 rounded-3xl border border-white/[0.07] bg-[var(--color-surface)] p-7"
      >
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Certifications
        </h3>
        <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c) => (
            <li key={c.name} className="text-sm">
              <span className="text-[var(--color-fg)]">{c.name}</span>
              <span className="block text-xs text-[var(--color-subtle)]">
                {c.issuer}
                {"year" in c && c.year ? ` · ${c.year}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
