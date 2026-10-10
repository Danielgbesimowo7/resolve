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
| `/app/conversations` | Filter panel, search, pagination, bulk select, take over, resolve, reopen |
| `/app/conversations/:id` | Conversation detail: thread with reply composer, Details / Activity / Notes tabs, AI analysis, quick actions |
| `/app/ai-performance` | Stats, performance by intent, trends over time, outcomes, underperforming intents |
| `/app/knowledge` | Knowledge gaps with priority filters, search and an update flow that publishes changes |
| `/app/customers` | Customer list with search, plan/segment/sort filters, selection and a profile panel with notes |
| `/app/analytics` | Stacked resolution bars, resolution trend, top channels, intent table |
| `/app/settings` | Account, Team, AI agent, Integrations, Plan and Billing, Workspace (all editable, saved in your browser) |

Everything in the app runs on realistic mock data (`src/data/mock.ts`, 640 seeded conversations). Changes you make
(taking over, resolving, replying, notes, date range, AI on/off) persist in `localStorage`; "Reset demo data" is in the profile menu.

## Structure

```
src/
  landing/     one component per section + effects.ts (scroll/animation behaviour) + motion.ts/motion.css (How it works + Features interaction layer) + landing.css
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
- `/app/teams` redirects to Settings → Team (there is no separate Teams design).
- The landing page was redesigned again in Figma (stepper + large cards in How it works, tabbed Features). That redesign is not in this build yet.

## Push to GitHub

```bash
git init && git add . && git commit -m "Initial Resolve app"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## Deploy to Vercel

1. Push this project to GitHub (commands above).
2. In Vercel: Add New → Project → import the repo. Framework preset is detected as Vite
   (build command `npm run build`, output directory `dist`). No environment variables are needed.
3. Click Deploy. Every later `git push` to `main` redeploys automatically.

`vercel.json` rewrites all paths to `index.html`, so refreshing `/app` or `/login` works.
