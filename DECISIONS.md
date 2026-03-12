# Portfolio FE — Architectural Decisions

## Technology Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Build tool | Vite 7 + React 19 + TypeScript | Fast HMR, modern bundling, strict types |
| Styling | Tailwind CSS v4 (CSS-first) | Zero config JS, design tokens in CSS `@theme {}` |
| Components | shadcn/ui | Owned source code, full customisability, Tailwind v4 native |
| Animation | Framer Motion 12 | Spring physics, `MotionConfig reducedMotion="user"` built-in |
| State | Zustand 5 + `persist` middleware | Minimal boilerplate, no manual localStorage calls |
| Routing | React Router v7 | Stable, well-known API |
| i18n | react-i18next | Industry standard for React i18n |
| Forms | react-hook-form + Zod | Uncontrolled forms with schema validation |
| Testing | Vitest + jsdom + @testing-library/react | Vite-native, fast, compatible |
| Deploy | Vercel (free tier) | Zero config SPA hosting, auto-deploy on push |

## Key Rules (Non-negotiable)

1. **No `tailwind.config.js`** — All Tailwind config lives in `src/index.css` via `@theme {}`.
2. **No `localStorage.setItem/getItem`** — All persistence via `zustand/middleware persist`.
3. **No `../../` relative imports** — Always use `@/` alias; ESLint enforces this.
4. **No `new WebSocket()` in components** — Only in `src/hooks/useWebSocket.ts` (future story).
5. **`<MotionConfig reducedMotion="user">` at App root** — Single point of `prefers-reduced-motion` compliance.
6. **Spring tokens from `constants/motion.ts` only** — Never inline `stiffness`/`damping`.
7. **shadcn components are owned code** — Use `pnpm dlx shadcn@latest add [component]`.
8. **React Router v7** — Not v6.
9. **TypeScript strict mode** — No `any` bypasses.

## Phase 2 Hooks (Reserved, Not Implemented)

- **Command palette keyboard registry** — Stub comment in `App.tsx`.
- **AI rate limiting tier in Nginx** — Documented here for BE team reference.
- **Video walkthrough space** — Layout slot reserved in `ProjectDetailPage.tsx`.

## SSG Verification (Sprint 0 Required)

> `vite-plugin-ssg` is NOT added. Vite 7 compatibility is unverified.
>
> After first deploy to Vercel, run Lighthouse to measure LCP:
> - LCP < 1.5s with SPA → No SSG needed
> - LCP ≥ 1.5s → Evaluate: (A) SPA + preload hints, or (B) Migrate to Astro
