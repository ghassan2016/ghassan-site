import { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-[var(--color-border)] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {eyebrow}
          </div>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)]">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
