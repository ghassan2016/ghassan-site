import Link from "next/link";
import { nav, profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 sm:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="text-lg font-semibold tracking-tight text-[var(--color-fg)]">{profile.name}</div>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
            {profile.role} — designed and engineered in Gaza, Palestine.
          </p>
        </div>
        <nav aria-label="Footer">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">Site</div>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-subtle)]">Elsewhere</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`mailto:${profile.email}`} className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
                Email
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
                WhatsApp
              </a>
            </li>
            <li>
              <Link href="/cv" className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
                Résumé
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 text-xs text-[var(--color-subtle)] lg:px-8">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>Built with Next.js · Tailwind CSS</span>
      </div>

      <div
        aria-hidden
        className="pointer-events-none mt-6 select-none whitespace-nowrap text-center font-serif text-[23vw] italic leading-[0.78] tracking-[-0.04em] text-transparent [background:linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0))] [-webkit-background-clip:text] [background-clip:text]"
      >
        Ghassan
      </div>
    </footer>
  );
}
