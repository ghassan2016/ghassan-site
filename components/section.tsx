import { ReactNode } from "react";

export function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  id?: string;
  index?: string;
  eyebrow: string;
  /** Wrap words in <em> for the serif-italic gradient accent. */
  title: ReactNode;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative py-24 lg:py-36 ${className}`}>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          index={index}
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  className = "mb-14 lg:mb-20",
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div data-reveal className={`max-w-3xl ${className}`}>
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {index && <span className="text-[var(--color-accent)]">{index}</span>}
        <span className="h-px w-8 bg-[var(--color-border-strong)]" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="serif-em mt-5 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[var(--color-fg)] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
