import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js.
        </div>
        <div className="flex items-center gap-5">
          <a
            href={`mailto:${profile.email}`}
            className="hover:text-[var(--color-fg)] link-underline"
          >
            Email
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-fg)] link-underline"
          >
            LinkedIn
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-fg)] link-underline"
          >
            CV
          </a>
        </div>
      </div>
    </footer>
  );
}
