# Simple Lecture

Vite + React + TypeScript + shadcn/ui + Supabase + Capacitor app for online lectures and education (SimpleLecture).

## Install

```bash
npm install
```

or

```bash
bun install
```

The repo includes both `package-lock.json` and `bun.lock`.

## Run locally

```bash
npm run dev
```

Vite serves the app at http://localhost:8080 (see `vite.config.ts`).

Copy environment variables from `.env.example` into `.env` if that file is present. This repository does not currently include `.env.example`. Some client code also reads `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_ANON_KEY`, and `VITE_NOTES_API_BASE`.

## Scripts

| Script | Command |
| --- | --- |
| Dev server | `npm run dev` |
| Production build + prerender | `npm run build` |
| Vite build only | `npm run build:fast` |
| Preview production build | `npm run preview` |
| Lint | `npm run lint` |
| Tests | `npm test` |
