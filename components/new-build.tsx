import Image from "next/image";
import { newBuild } from "@/lib/data";
import { delay } from "@/lib/style";

export function NewBuild() {
  return (
    <section id="qareeb" className="relative py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(90%_80%_at_80%_20%,#2c1fb0_0%,#190f6f_40%,#0b0826_100%)]"
        >
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#b4ff3c]/10 blur-3xl" aria-hidden />

          <div className="relative grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-[1.05fr_1fr] lg:p-16">
            {/* copy */}
            <div>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
                <span className="text-[#b4ff3c]">02</span>
                <span className="h-px w-8 bg-white/20" />
                <span>New · Built from zero</span>
              </div>

              <div className="mt-6 flex items-end gap-4">
                <h2 className="text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">
                  {newBuild.name}
                </h2>
                <span lang="ar" dir="rtl" className="pb-1 font-arabic text-3xl font-semibold text-white/50 sm:text-4xl">
                  {newBuild.nameAr}
                </span>
              </div>
              <p className="mt-2 font-serif text-xl italic text-white/60">{newBuild.meaning}</p>

              <p className="mt-6 text-xl font-medium tracking-[-0.015em] text-white">{newBuild.tagline}</p>
              <p className="mt-4 max-w-xl text-pretty leading-relaxed text-white/70">{newBuild.description}</p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {newBuild.highlights.map((h, i) => (
                  <li
                    key={h.title}
                    data-reveal
                    style={delay(100 + i * 70)}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur"
                  >
                    <div className="text-sm font-semibold text-white">{h.title}</div>
                    <div className="mt-1 text-[13px] leading-relaxed text-white/60">{h.body}</div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={newBuild.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#b4ff3c] px-6 py-3 text-sm font-semibold text-[#190f6f] transition-transform hover:scale-[1.03]"
                >
                  Visit {newBuild.domain}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
                <div className="flex flex-wrap gap-2">
                  {newBuild.stack.map((t) => (
                    <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* phones: same product, both directions */}
            <div className="relative mx-auto flex h-[440px] w-full max-w-[460px] items-center justify-center sm:h-[540px]">
              <div className="phone absolute left-[4%] top-[6%] w-[48%] max-w-[230px] -rotate-[7deg]">
                <div className="phone-screen aspect-[488/1055]">
                  <Image src={newBuild.screens.ar.src} alt={newBuild.screens.ar.alt} fill sizes="230px" className="object-cover" />
                </div>
              </div>
              <div className="phone float-slow absolute right-[4%] top-[14%] z-10 w-[48%] max-w-[230px] rotate-[6deg]">
                <div className="phone-screen aspect-[488/1055]">
                  <Image src={newBuild.screens.en.src} alt={newBuild.screens.en.alt} fill sizes="230px" className="object-cover" />
                </div>
              </div>
              <span className="absolute bottom-[4%] left-[8%] rounded-full border border-white/15 bg-[#0b0826]/80 px-3 py-1 font-arabic text-xs text-white backdrop-blur">
                عربي · RTL
              </span>
              <span className="absolute bottom-[2%] right-[10%] z-20 rounded-full border border-white/15 bg-[#0b0826]/80 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur">
                English · LTR
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
