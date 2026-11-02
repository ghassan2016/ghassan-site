import { profile, shippedFor, stats } from "@/lib/data";
import { delay } from "@/lib/style";
import { Portrait } from "./portrait";
import { LocalTime } from "./local-time";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 sm:pt-40 lg:pt-44">
      <div className="aurora -z-10" aria-hidden>
        <span className="a1" />
        <span className="a2" />
        <span className="a3" />
      </div>
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-10">
          {/* LEFT — copy */}
          <div>
            <a
              href="#brightgaza"
              className="intro group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3.5 text-[13px] text-[var(--color-muted)] backdrop-blur transition-colors hover:border-white/20 hover:text-[var(--color-fg)]"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Now
              </span>
              Engineering BrightGaza
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>

            <p
              className="intro mt-9 font-mono text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]"
              style={delay(60)}
            >
              {profile.name} <span className="text-[var(--color-accent)]">/</span> {profile.role}
            </p>

            <h1
              className="intro serif-em mt-4 text-balance text-[clamp(2.9rem,7.4vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-[var(--color-fg)]"
              style={delay(120)}
            >
              Building software people <em>rely on.</em>
            </h1>

            <p
              className="intro mt-8 max-w-xl text-pretty text-lg leading-relaxed text-[var(--color-muted)]"
              style={delay(200)}
            >
              {profile.heroLine}
            </p>

            <div className="intro mt-10 flex flex-wrap items-center gap-3" style={delay(280)}>
              <a
                href="#brightgaza"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-fg)] px-6 py-3 text-sm font-medium text-[var(--color-bg)] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_12px_40px_-12px_rgba(139,123,255,0.7)] transition-transform hover:scale-[1.03]"
              >
                See my flagship work
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-medium text-[var(--color-fg)] backdrop-blur transition-colors hover:border-white/20 hover:bg-white/[0.07]"
              >
                Get in touch
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-3 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]"
              >
                Download CV
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
                </svg>
              </a>
            </div>
          </div>

          {/* RIGHT — portrait */}
          <div className="intro relative mx-auto w-full max-w-[360px] sm:max-w-[400px]" style={delay(220)}>
            <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(139,123,255,0.35),transparent)] blur-2xl" />

            <Portrait />

            {/* code chip */}
            <div className="float-slow absolute -right-3 top-6 z-10 hidden rounded-2xl border border-white/10 bg-[#0d0d14]/80 p-4 font-mono text-[11px] leading-[1.7] shadow-2xl backdrop-blur-xl sm:block lg:-right-12">
              <div className="mb-2.5 flex gap-1.5" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                <span className="h-2 w-2 rounded-full bg-[#28c840]" />
              </div>
              <div>
                <span className="text-[#c792ea]">const</span>{" "}
                <span className="text-[#82aaff]">ghassan</span>{" "}
                <span className="text-[var(--color-muted)]">=</span> {"{"}
              </div>
              <div className="pl-4">
                role: <span className="text-[#c3e88d]">&quot;software engineer&quot;</span>,
              </div>
              <div className="pl-4">
                ships: <span className="text-[#c3e88d]">&quot;end-to-end&quot;</span>,
              </div>
              <div className="pl-4">
                speaks: [<span className="text-[#c3e88d]">&quot;ar&quot;</span>,{" "}
                <span className="text-[#c3e88d]">&quot;en&quot;</span>],
              </div>
              <div>{"}"}</div>
            </div>

            {/* location chip */}
            <div className="absolute -bottom-4 -left-3 z-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0d14]/80 py-2.5 pl-3 pr-4 shadow-2xl backdrop-blur-xl lg:-left-10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent-2)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-accent-2)]" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-medium text-[var(--color-fg)]">{profile.shortLocation}</div>
                <div className="font-mono text-[11px] text-[var(--color-muted)]">
                  <LocalTime /> local · remote-ready
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* stats */}
        <dl
          className="intro mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] lg:grid-cols-4"
          style={delay(380)}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse bg-[#060609]/85 p-6 backdrop-blur sm:p-7">
              <dt className="mt-2 text-sm text-[var(--color-muted)]">{s.label}</dt>
              <dd className="text-3xl font-semibold tracking-[-0.03em] text-[var(--color-fg)] sm:text-4xl">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* marquee */}
      <div className="mt-20 border-y border-white/[0.06] py-8">
        <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-subtle)]">
          Shipped for teams &amp; institutions across Palestine and the Gulf
        </p>
        <div className="marquee overflow-hidden">
          <ul className="marquee-track">
            {[...shippedFor, ...shippedFor].map((name, i) => (
              <li
                key={i}
                aria-hidden={i >= shippedFor.length}
                className="flex items-center whitespace-nowrap px-7 text-xl font-medium tracking-[-0.02em] text-white/45 sm:text-2xl"
              >
                {name}
                <span aria-hidden className="ml-14 text-sm text-[#8b7bff]/70">
                  ✦
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
