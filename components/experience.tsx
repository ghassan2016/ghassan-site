import { experience, yearsShipping } from "@/lib/data";
import { delay } from "@/lib/style";
import { Section } from "./section";

export function Experience() {
  return (
    <Section
      id="experience"
      index="06"
      eyebrow="Experience"
      title={
        <>
          {yearsShipping} years of <em>shipping to production.</em>
        </>
      }
      description="Product engineering, backend systems, and admin platforms — for startups, government bodies, and human-rights organisations across Palestine and the Gulf."
    >
      <ol className="relative">
        {/* timeline rail */}
        <span
          aria-hidden
          className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-[var(--color-accent)] via-white/10 to-transparent lg:left-[231px]"
        />
        {experience.map((job, i) => (
          <li
            key={job.company}
            data-reveal
            style={delay(i * 60)}
            className="relative grid gap-3 pb-14 pl-10 last:pb-0 lg:grid-cols-[200px_1fr] lg:gap-16 lg:pl-0"
          >
            <span
              aria-hidden
              className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 lg:left-[224px] ${
                job.current
                  ? "border-[var(--color-accent)] bg-[var(--color-bg)] shadow-[0_0_0_4px_rgba(139,123,255,0.15),0_0_20px_rgba(139,123,255,0.6)]"
                  : "border-[var(--color-border-strong)] bg-[var(--color-bg)]"
              }`}
            />

            <div className="lg:pt-0.5 lg:text-right">
              <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
                {job.period}
              </div>
              <div className="mt-1 text-xs text-[var(--color-subtle)]">{job.location}</div>
            </div>

            <div className="lg:pl-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-fg)] sm:text-2xl">
                  {job.role}
                </h3>
                {job.current && (
                  <span className="rounded-full bg-[var(--color-accent-soft)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#c4b8ff]">
                    Current
                  </span>
                )}
              </div>
              <div className="mt-1 text-[15px] text-[#b3a9ff]">{job.company}</div>
              <ul className="mt-5 space-y-3">
                {job.bullets.map((b) => (
                  <li
                    key={b}
                    className="relative max-w-3xl pl-5 text-[15px] leading-relaxed text-[var(--color-muted)] before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-[var(--color-subtle)]"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
