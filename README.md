# Ghassan Ahmed — Personal Site

Minimal, premium personal site built with **Next.js 14 (App Router)** + **Tailwind v3** + **TypeScript**. Dark aesthetic, fully responsive, accessible, SEO-ready — plus a floating "Digital Ghassan" AI chat widget powered by Gemini.

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
public/portrait.jpg
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

Edit `lib/digital-ghassan-persona.ts` — the `DIGITAL_GHASSAN_SYSTEM_PROMPT` constant. Currently grounded in your CV: identity, current work (PalAI, ArabTalents), prior roles, stack, contact, voice rules, and boundaries.

When you edit the prompt and want the gem on Gemini to update, you'll need to delete the gem from gemini.google.com (or call `client.updateGem(...)` from a script). Or just bump the gem name — the server will create a new one.

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
│   ├── experience.tsx, projects.tsx, skills.tsx
│   ├── contact.tsx, footer.tsx, section.tsx
│   └── chat-widget.tsx               # Floating chat launcher + panel
├── lib/
│   ├── data.ts                       # ALL content (single source of truth)
│   ├── digital-ghassan-persona.ts    # Gem name + system prompt
│   ├── gemini.server.ts              # Wraps gemini-reversed for the API route
│   └── gemini-reversed/              # Vendored client (CommonJS)
├── public/
│   ├── Ghassan_Ahmed_CV.pdf
│   └── portrait.jpg                  # ← drop your photo here
├── .env.example
├── next.config.mjs                   # Webpack externalizes gemini-reversed
└── ...
```

**To update content:** edit `lib/data.ts` and `lib/digital-ghassan-persona.ts`. No copy is hard-coded inside components.

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
| `--color-bg` | `#08080b` | Page background |
| `--color-fg` | `#f5f5f7` | Primary text |
| `--color-muted` | `#8b8b96` | Secondary text |
| `--color-accent` | `#7c9eff` | Eyebrow labels, focus rings |
| `--color-surface` | `#0f0f14` | Card backgrounds |

Swap the accent token to re-brand the entire site.

---

## License

MIT — Ghassan Ahmed
