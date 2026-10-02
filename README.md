# Jesper Landberg — Portfolio Recreation

A pixel-faithful DOM/CSS recreation of [jesperlandberg.com](https://jesperlandberg.com/) built with Next.js 16, TypeScript and Tailwind CSS 4.

The original site is a three.js/WebGL experience. This recreation reproduces its look and behaviour with plain DOM + CSS 3D transforms and a custom scroll engine — no WebGL.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS 4** with a custom design system that mirrors the reference:
  - `1` spacing unit = `0.1rem`, fluid root `font-size` (`clamp(10px, 100vw/39, 16.641px)` below 650px, `clamp(5px, 100vw/150, 12.8px)` above)
  - custom `s:` breakpoint at 650px, `label` utility (1rem / 500 / uppercase)
- **Inter Tight** (closest free match to the reference's ABC Diatype Plus Variable)
- **Framer Motion** for overlay transitions
- **Prisma + SQLite** for newsletter subscribers

## Features

- **Home (`/`)** — 3D card gallery: wheel/drag/touch scroll with momentum, per-card `rotateY`/`rotateX` tilt by distance from center, edge fading, perspective floor with parallax, intro loader (`— - .`)
- **Profile overlay** — gold torus ring (pure CSS conic gradients + mask), centered bio
- **Newsletter overlay** — pill input + round submit button, server-side validation via `/api/subscribe`
- **Project pages (`/projects/[slug]`)** — white sheet layout with sticky left column, scrolling media column, progress ring, prev/next edge navigation
- **Full index (`/full`)** — centered name cloud with bullet dots
- Gallery position + intro state are kept across route changes (session-scoped)

## Getting started

```bash
cp .env.example .env     # adjust DATABASE_URL if needed
bun install
bun run db:push          # create the SQLite schema
bun run dev              # http://localhost:3000
```

## Notes

- Project media uses a single generated cream placeholder image (per the brief, the original photography/videos are intentionally not reproduced).
- The newsletter API rejects obviously fake addresses and stores real ones in SQLite.
