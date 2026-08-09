# CareerForge AI

Student-only AI placement preparation platform. No admin panel.

## Stack
Next.js (App Router) · React · TypeScript · Tailwind CSS · lucide-react

This repo contains the full frontend layout and design for every route in
the product spec — landing site, auth pages, and the entire student
dashboard (11 modules). Data on every page is mocked/static; there is no
database, auth, or AI wiring yet. That's the next phase (see the build
order below).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Route map

Public:
- `/` landing
- `/about`, `/features`, `/how-it-works`, `/research`, `/faq`, `/contact`
- `/login`, `/register`

Dashboard (all under `/dashboard`):
- `/dashboard` overview
- `/dashboard/career`
- `/dashboard/skills`
- `/dashboard/roadmap`
- `/dashboard/resume`
- `/dashboard/aptitude`
- `/dashboard/projects`
- `/dashboard/interview`
- `/dashboard/analytics`
- `/dashboard/mentor`
- `/dashboard/portfolio`
- `/dashboard/profile`
- `/dashboard/settings`

## Design system

Colors, panels, gauges, and score bars live in `src/components/ui`.
Everything shares the same blueprint/forge visual language: deep navy
canvas, dotted grid, cyan trace accents, forge-orange CTAs, monospace
technical labels, corner-bracketed panels.

## Next steps (per the build order)

1. Wire up PostgreSQL + Prisma (`prisma/schema.prisma`)
2. Add Auth.js and protect `/dashboard/*`
3. Replace mock data in each dashboard page with real API calls
4. Add the Gemini-backed services (career, resume, interview, mentor)
