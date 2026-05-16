import { Section } from "./section";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Five years shipping in production"
      description="Backend systems, RESTful APIs, and admin platforms for government, human-rights, and tech-enabled-talent products across Palestine and the Gulf."
    >
      <ol className="relative space-y-12 border-l border-[var(--color-border)] pl-8">
        {experience.map((job) => (
          <li key={job.company} className="relative">
            <span className="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)]" />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-fg)]">
                  {job.role}
                </h3>
                <div className="text-sm text-[var(--color-muted)]">
                  {job.company} · {job.location}
                </div>
              </div>
              <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-subtle)]">
                {job.period}
              </div>
            </div>
            <ul className="mt-4 space-y-2.5">
              {job.bullets.map((b, i) => (
                <li
                  key={i}
                  className="relative pl-5 text-sm leading-relaxed text-[var(--color-muted)] before:absolute before:left-0 before:top-2.5 before:h-1 before:w-1 before:rounded-full before:bg-[var(--color-subtle)]"
                >
                  {b}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
