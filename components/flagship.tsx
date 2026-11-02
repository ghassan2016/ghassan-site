import Image from "next/image";
import { flagship } from "@/lib/data";
import { delay } from "@/lib/style";
import { SectionHeading } from "./section";

export function Flagship() {
  return (
    <section id="brightgaza" className="relative overflow-x-clip py-24 lg:py-36">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          index="01"
          eyebrow="Flagship"
          title={
            <>
              Connecting Gaza&apos;s talent <em>to the world.</em>
            </>
          }
          description={flagship.description}
        />

        {/* Showcase: desktop in a browser frame, Arabic build on a phone */}
        <div className="relative">
          <div className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 bg-[radial-gradient(60%_50%_at_30%_40%,rgba(11,120,208,0.35),transparent),radial-gradient(40%_40%_at_85%_70%,rgba(34,197,94,0.2),transparent)] blur-2xl" />

          <div data-reveal className="tilt-in relative pb-12 sm:pb-16">
            <a
              href={flagship.href}
              target="_blank"
              rel="noopener noreferrer"
              className="browser group block"
              aria-label={`Open ${flagship.domain}`}
            >
              <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#16161d] px-4 py-3">
                <div className="flex gap-1.5" aria-hidden>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div className="mx-auto flex items-center gap-1.5 rounded-md bg-white/[0.05] px-3 py-1 font-mono text-[11px] text-[var(--color-muted)] sm:px-16">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  {flagship.domain}
                </div>
                <span className="w-10" aria-hidden />
              </div>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={flagship.screens.desktop.src}
                  alt={flagship.screens.desktop.alt}
                  fill
                  sizes="(min-width: 1152px) 1088px, 100vw"
                  className="object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.02]"
                />
              </div>
            </a>

            <div className="phone absolute bottom-0 right-3 w-[27%] min-w-[120px] max-w-[250px] rotate-[4deg] sm:-right-4 lg:-right-10">
              <div className="phone-screen aspect-[390/844]">
                <Image
                  src={flagship.screens.mobile.src}
                  alt={flagship.screens.mobile.alt}
                  fill
                  sizes="250px"
                  className="object-cover object-top"
                />
              </div>
            </div>

            <span className="absolute -top-3 left-6 rounded-full border border-white/10 bg-[#0d0d14]/90 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] backdrop-blur">
              English · LTR
            </span>
            <span className="absolute bottom-[42%] right-[24%] hidden rounded-full border border-white/10 bg-[#0d0d14]/90 px-3 py-1 font-arabic text-xs text-[var(--color-fg)] backdrop-blur sm:block lg:right-[20%]">
              العربية · RTL
            </span>
          </div>
        </div>

        {/* Platform metrics */}
        <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-white/[0.07] pt-12 lg:grid-cols-4">
          {flagship.metrics.map((m, i) => (
            <div key={m.label} data-reveal style={delay(i * 90)}>
              <dd className="text-gradient text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {m.value}
              </dd>
              <dt className="mt-2 text-sm text-[var(--color-muted)]">{m.label}</dt>
            </div>
          ))}
        </dl>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">
          Platform figures, as published on {flagship.domain}
        </p>

        {/* Role + what's inside */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div data-reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              {flagship.role}
            </div>
            <p className="mt-6 text-2xl font-medium leading-snug tracking-[-0.02em] text-[var(--color-fg)] sm:text-3xl">
              {flagship.tagline}{" "}
              <span className="text-[var(--color-muted)]">
                A trusted, bilingual marketplace for real remote work — built to hold up under real money and real deadlines.
              </span>
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {flagship.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-[var(--color-muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
            <a
              href={flagship.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--color-fg)] px-6 py-3 text-sm font-medium text-[var(--color-bg)] transition-transform hover:scale-[1.03]"
            >
              Visit {flagship.domain}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </a>
          </div>

          <ul data-reveal style={delay(120)} className="divide-y divide-white/[0.07] rounded-3xl border border-white/[0.07] bg-white/[0.02] px-6 backdrop-blur sm:px-8">
            {flagship.highlights.map((h) => (
              <li key={h} className="flex items-center gap-4 py-5 text-base text-[var(--color-fg)]">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
