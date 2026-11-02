# Ghassan Ahmed — Personal Site

Personal site built with **Next.js 14 (App Router)** + **Tailwind v3** + **TypeScript**. Dark editorial aesthetic with aurora gradients, scroll reveals, spotlight cards and device-frame showcases (BrightGaza flagship, Qareeb). Fully responsive, reduced-motion aware, SEO-ready with a generated share image — plus a floating "Digital Ghassan" AI chat widget powered by Gemini.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open http://localhost:3000

---

## 1) Add the portrait

Drop your photo at:

```
public/portrait.jpeg
```

The hero detects it automatically. If missing, the hero falls back to a clean "GA" monogram so the layout never breaks.

---

## 2) Configure the contact form

Pick **one** provider in `.env.local`:

```bash
# A — Formspree (easiest, free 50/mo)
NEXT_PUBLIC_FORMSPREE_ID=your_form_id

# B — Resend (transactional email, free 100/day)
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_TO_EMAIL=gssan1018@gmail.com
```

Without either, the form returns a clean error telling visitors to email directly.

---

## 3) Configure the Digital Ghassan chat

The chat is a floating bottom-right widget. It uses the **vendored `gemini-reversed`** client (`lib/gemini-reversed/`) talking to `gemini.google.com` with Google account cookies — and a custom **"Digital Ghassan" gem** that the persona prompt lives in (`lib/digital-ghassan-persona.ts`).

### Get your cookies

1. Sign into https://gemini.google.com in a Chrome **Incognito** window (use a dedicated Google account — see warning below).
2. DevTools (F12) → **Application** → **Cookies** → `gemini.google.com`.
3. Copy the values of `__Secure-1PSID` and `__Secure-1PSIDTS`.
4. Paste into `.env.local`:

```bash
GEMINI_SECURE_1PSID=g.a000...
GEMINI_SECURE_1PSIDTS=sidts-...
CHAT_ENABLED=true
```

5. Restart `npm run dev`. First message triggers gem creation (idempotent — reuses if already exists on the account).

### Security — read this

These are **full Google account cookies, not API tokens**. Anyone with access to your server (or `.env.local` file) gets full access to that Google account — Gmail, Drive, everything.

Mitigations baked in:

| Mitigation | Where |
|---|---|
| Cookies live only in env vars, never sent to client | `lib/gemini.server.ts` |
| All Gemini calls server-side | `app/api/chat/route.ts` (Node runtime, never Edge) |
| IP rate limit (8 req/min) | `app/api/chat/route.ts` |
| `CHAT_ENABLED=false` kill switch | check at start of `streamChat` |
| `.env.local` in `.gitignore` | confirm before pushing |

**Strong recommendations:**
- Use a **dedicated Google account** for this — not your main one.
- Set `CHAT_ENABLED=false` instantly if you suspect a leak.
- Cookies expire: `__Secure-1PSIDTS` rotates every ~10 min (auto-refreshed by the client). `__Secure-1PSID` lasts months but eventually needs re-export.
- Self-host on Vercel/Railway/Fly in a region close to your visitors. Don't deploy to platforms with shared infra you don't trust.

### Customize the persona

Edit `lib/digital-ghassan-persona.ts` — the `DIGITAL_GHASSAN_SYSTEM_PROMPT` constant. Currently grounded in your CV: identity, current work (BrightGaza, Qareeb, PalAI, ArabTalents), prior roles, stack, contact, voice rules, and boundaries.

When you edit the prompt and want the gem on Gemini to update, you'll need to delete the gem from gemini.google.com (or call `client.updateGem(...)` from a script). Or just bump `DIGITAL_GHASSAN_GEM_NAME` (currently `Digital Ghassan v2`) — the server will create a new one.

---

## Project structure

```
ghassan-site/
├── app/
│   ├── layout.tsx                    # Root layout + mounts <ChatWidget />
│   ├── page.tsx                      # Single-page composition
│   ├── globals.css                   # Tailwind + design tokens
│   ├── api/
│   │   ├── contact/route.ts          # Contact form (Formspree / Resend)
│   │   └── chat/route.ts             # Streaming Digital Ghassan endpoint
├── components/
│   ├── nav.tsx, hero.tsx, portrait.tsx, about.tsx
│   ├── flagship.tsx (BrightGaza), new-build.tsx (Qareeb)
│   ├── experience.tsx, projects.tsx, skills.tsx, philosophy.tsx
│   ├── reveal.tsx, spotlight.tsx, local-time.tsx
│   ├── contact.tsx, footer.tsx, section.tsx
│   └── chat-widget.tsx               # Floating chat launcher + panel
├── lib/
│   ├── data.ts                       # ALL content (single source of truth)
│   ├── digital-ghassan-persona.ts    # Gem name + system prompt
│   ├── gemini.server.ts              # Wraps gemini-reversed for the API route
│   └── gemini-reversed/              # Vendored client (CommonJS)
├── public/
│   ├── Ghassan_Ahmed_CV.pdf
│   └── portrait.jpeg                  # ← drop your photo here
├── .env.example
├── next.config.mjs                   # Webpack externalizes gemini-reversed
└── ...
```

**To update content:** edit `lib/data.ts` and `lib/digital-ghassan-persona.ts`. No copy is hard-coded inside components.

---

## Regenerate the CV PDF

The résumé lives in `lib/cv.ts` and renders at `/cv` (single column, real text, standard headings — built to parse cleanly in applicant-tracking systems). After editing it, print the page to the PDF the site links to:

```bash
npm run dev
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --no-pdf-header-footer --print-to-pdf="public/Ghassan_Ahmed_CV.pdf" http://localhost:3000/cv
```

(Any Chromium works — or open `/cv` and use the browser's Print → Save as PDF with headers/footers off.)

---

## Build & deploy

```bash
npm run build
npm run start
```

Recommended hosts:

- **Vercel** — `vercel --prod`. Set env vars in the dashboard. Use a single region close to you (cookies geo-pinned).
- **Railway / Fly.io / Render** — set env vars, deploy from GitHub.
- **Self-hosted** — `npm run build && node .next/standalone/server.js`

> ⚠️ Don't deploy the chat to platforms where the cookies could be inspected by other tenants. The chat is fine on Vercel/Railway/Fly. Avoid free-tier shared shells.

---

## Brand tokens (in `app/globals.css`)

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#060609` | Page background |
| `--color-fg` | `#f4f4f6` | Primary text |
| `--color-muted` | `#9d9daa` | Secondary text |
| `--color-accent` | `#8b7bff` | Violet accent, focus rings, gradients |
| `--color-accent-2` | `#4fd1e8` | Cyan accent, gradient end |
| `--color-surface` | `#0c0c11` | Card backgrounds |

Fonts (via `next/font`): Inter Tight (UI), Instrument Serif italic (accent words — wrap them in `<em>` inside section titles), JetBrains Mono (labels), IBM Plex Sans Arabic (Arabic text).

Project screenshots live in `public/work/`.

Swap the accent token to re-brand the entire site.

---

## License

MIT — Ghassan Ahmed
