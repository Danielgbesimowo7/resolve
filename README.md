# Resolve

AI customer-support operations: a marketing site plus a working dashboard, built with Vite, React and TypeScript.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## What is in here

| Path | What it is |
| --- | --- |
| `/` | Landing page (`src/landing`) |
| `/login` | Demo sign-in. Any email and password works; the session lives in `localStorage` |
| `/app` | Dashboard: stats, volume chart, outcomes donut, recent conversations |
| `/app/conversations` | Filters, search, sorting, pagination, bulk select, take over, resolve, reopen, reply in a slide-over |
| `/app/*` (other nav items) | Placeholder pages, ready for their designs |

Everything in the app runs on realistic mock data (`src/data/mock.ts`, 640 seeded conversations). Changes you make
(taking over, resolving, replying, date range, AI on/off) persist in `localStorage`; "Reset demo data" is in the profile menu.

## Structure

```
src/
  landing/     one component per section + effects.ts (scroll/animation behaviour) + landing.css
  app/         AppShell, Dashboard, Conversations, Drawer, ui.tsx, app.css (all classes prefixed rs-)
  state/       auth.tsx, store.tsx (reducer; the only place that mutates conversations)
  data/        mock.ts  <- replace with API calls when a backend exists
  pages/       Login.tsx
```

## Known follow-ups

- `landing/effects.ts` is the original DOM-driven animation script (marked `@ts-nocheck`). It works, but the next refactor is
  to split it into per-section React hooks and type it.
- Landing CSS is injected only while `/` is mounted, so it cannot affect the app.
- Avatars are generated illustrations in `src/faces.ts`. Swap in the real photos exported from Figma.
- Remaining dashboard screens (AI performance, Knowledge, Customers, Analytics, Teams, Settings) are placeholders.

## Push to GitHub

```bash
git init && git add . && git commit -m "Initial Resolve app"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
