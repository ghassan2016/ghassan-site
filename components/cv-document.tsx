import Link from "next/link";
import { ReactNode } from "react";
import type { Cv } from "@/lib/cv";

/**
 * ATS-friendly résumé: one column, real text, standard headings, no tables
 * or icons. Each /cv route renders this and is printed to its PDF.
 */
export function CvDocument({ cv, pdfUrl }: { cv: Cv; pdfUrl: string }) {
  return (
    <div className="cv-page min-h-screen bg-[#ececf0] text-[#16161d]">
      <div className="cv-toolbar sticky top-0 z-10 border-b border-black/10 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-[210mm] items-center justify-between gap-4 px-4 py-3 text-sm">
          <Link href="/" className="text-[#55556a] transition-colors hover:text-black">
            ← Back to site
          </Link>
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-2 rounded-full bg-[#16161d] px-4 py-2 font-medium text-white transition-transform hover:scale-[1.03]"
          >
            Download PDF
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />
            </svg>
          </a>
        </div>
      </div>

      <article className="cv-sheet mx-auto my-8 max-w-[210mm] bg-white px-[8mm] py-[10mm] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] sm:my-12 sm:px-[16mm] sm:py-[14mm]">
        <header>
          <h1 className="text-[25pt] font-bold leading-none tracking-[-0.02em] text-[#0e0e14]">{cv.name}</h1>
          <p className="mt-1.5 text-[12.5pt] font-semibold text-[#3a2fc4]">{cv.headline}</p>
          <p className="mt-2 text-[9.5pt] leading-relaxed text-[#3a3a48]">
            {cv.contact.map((c, i) => (
              <span key={c.label} className="whitespace-nowrap">
                {i > 0 && <span className="px-1.5 text-[#a0a0ad]">|</span>}
                {c.href ? (
                  <a href={c.href} className="hover:underline">
                    {c.label}
                  </a>
                ) : (
                  c.label
                )}
              </span>
            ))}
          </p>
        </header>

        <CvSection title="Professional Summary">
          <p>{cv.summary}</p>
        </CvSection>

        {cv.expertise && (
          <CvSection title="Core Expertise">
            <p>
              <Terms list={cv.expertise} />
            </p>
          </CvSection>
        )}

        <CvSection title="Technical Skills">
          <ul className="space-y-0.5">
            {cv.skills.map((s) => (
              <li key={s.group}>
                <strong className="font-semibold text-[#0e0e14]">{s.group}:</strong> <Terms list={s.items} />
              </li>
            ))}
          </ul>
        </CvSection>

        <CvSection title="Professional Experience">
          <div className="space-y-3.5">
            {cv.experience.map((job) => (
              <div key={job.company} className="cv-entry">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[10.5pt] text-[#0e0e14]">
                    <strong className="font-semibold">{job.role}</strong>, {job.company}
                  </h3>
                  <span className="text-[9.5pt] font-medium text-[#3a3a48]">{job.period}</span>
                </div>
                <p className="text-[9.5pt] italic text-[#55556a]">{job.location}</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-[1.15em] marker:text-[#3a2fc4]">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CvSection>

        <CvSection title="Selected Projects">
          <div className="space-y-2">
            {cv.projects.map((p) => (
              <div key={p.name} className="cv-entry">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[10.5pt] text-[#0e0e14]">
                    <strong className="font-semibold">{p.name}</strong>, {p.kind}
                  </h3>
                  <span className="text-[9.5pt] text-[#3a3a48]">{p.url}</span>
                </div>
                <p>
                  {p.text} <span className="text-[#55556a]">Tech: {p.stack}.</span>
                </p>
              </div>
            ))}
            <p className="cv-entry">
              <strong className="font-semibold text-[#0e0e14]">Additional:</strong> {cv.additionalProjects}
            </p>
          </div>
        </CvSection>

        <CvSection title="Education">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-[10.5pt] text-[#0e0e14]">
              <strong className="font-semibold">{cv.education.degree}</strong>, {cv.education.institution}
            </h3>
            <span className="text-[9.5pt] font-medium text-[#3a3a48]">{cv.education.year}</span>
          </div>
          <p className="text-[9.5pt] text-[#55556a]">{cv.education.note}</p>
        </CvSection>

        <CvSection title="Certifications">
          <ul className="list-disc space-y-0.5 pl-[1.15em] marker:text-[#3a2fc4]">
            {cv.certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </CvSection>

        <CvSection title="Languages">
          <p>{cv.languages}</p>
        </CvSection>
      </article>
    </div>
  );
}

function CvSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-[5mm]">
      <h2 className="mb-1.5 border-b border-[#d6d6e0] pb-1 text-[10pt] font-bold uppercase tracking-[0.08em] text-[#3a2fc4]">
        {title}
      </h2>
      <div className="text-[10pt] leading-[1.42] text-[#26262f]">{children}</div>
    </section>
  );
}

/** Comma-separated keywords that never wrap mid-term ("Multi-Tenant" broke
 *  across lines and ATS read it as "MultiTenant"). */
function Terms({ list }: { list: string }) {
  return list.split(", ").map((term, i, all) => (
    <span key={term}>
      <span className="whitespace-nowrap">{term}</span>
      {i < all.length - 1 && ", "}
    </span>
  ));
}
