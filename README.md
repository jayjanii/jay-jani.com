# jay-jani.com

A personal site built with Astro and deployed on Cloudflare Pages. The homepage introduces the author and surfaces project cards (backed by D1). Standalone pages host heavier client-side work: a full-screen N-body / gravity simulation in Three.js, and an attention-visualization walkthrough for a Vision Transformer that uses Chart.js. Three small “apps” share the same stack pattern—public reads from SQLite via Workers, writes gated by a single admin password verified on the server, with the browser sending `Authorization: Bearer …` after a successful `POST /api/auth`. That design is deliberate simplicity for a single maintainer, not a general auth product.

### Stack

| Area | Details |
|------|---------|
| UI & routing | [Astro](https://astro.build) 6, file-based routes under `src/pages`, shared shell in `src/layouts/Layout.astro` |
| Styling | [Tailwind CSS](https://tailwindcss.com) 4 via `@tailwindcss/vite`, global tokens in `src/styles/global.css` |
| Hosting & API | [Cloudflare Pages](https://pages.cloudflare.com) + [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/); API routes are Workers handlers with `prerender = false` |
| Data | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite); schema and seeds in `migrations/` |
| Graphics | [Three.js](https://threejs.org) (`GravitySim.astro`, worker-backed physics); [Chart.js](https://www.chartjs.org/) on `attention.astro` |

### Pages

| URL | Source | Role |
|-----|--------|------|
| `/` | `src/pages/index.astro` | Profile, optional embedded sim, project cards from D1 |
| `/nbody` | `src/pages/nbody.astro` | Full N-body controls + `GravitySim` |
| `/attention` | `src/pages/attention.astro` | ViT attention article + charts |
| `/climbing`, `/climbing/admin` | `src/pages/climbing/*.astro` | Bouldering log UI and admin |
| `/reading`, `/reading/admin` | `src/pages/reading/*.astro` | Paper list, filters, admin |
| `/projects/admin` | `src/pages/projects/admin.astro` | Edit homepage projects (no public listing route) |

Admin screens share the same password gate and `localStorage` token pattern as the other admin UIs.

### HTTP API

| Path | Reads | Writes |
|------|--------|--------|
| `POST /api/auth` | - | Body `{ password }`; compares to server `ADMIN_PASSWORD` |
| `/api/climbs`, `/api/climbs/[id]` | `GET` public | `POST` / `PUT` / `DELETE` require Bearer admin |
| `/api/papers`, `/api/papers/[id]` | `GET` public | `POST` / `PUT` / `DELETE` require Bearer admin |
| `/api/projects`, `/api/projects/[id]` | `GET` public | `POST` / `PUT` / `DELETE` require Bearer admin |

Shared Bearer validation lives in `src/lib/server/auth.ts`. Browser helpers that call these APIs are `src/lib/climbing.ts`, `reading.ts`, and `projects.ts` (plus `verifyPassword` in `climbing.ts` used across admin pages).

### D1 tables

| Table | Used for |
|-------|----------|
| `climbs` | Log entries (grade, holds, date, notes, images, tags) |
| `papers` | Reading list (title, authors, URL, status, tags, notes) |
| `projects` | Homepage cards (title, copy, GitHub/demo links, sort order) |

### Repository layout

```
real-personal/
├── astro.config.mjs      # Cloudflare adapter, Tailwind plugin, null session driver
├── wrangler.toml         # D1 binding `DB`
├── migrations/           # ordered SQL for D1
└── src/
    ├── components/       # GravitySim, NBodySim, Welcome (starter)
    ├── layouts/
    ├── lib/              # client API modules; server/auth.ts for Workers
    ├── pages/            # `.astro` routes + `api/` handlers
    └── styles/
```

The N-body component hard-codes DOM ids (`gravity-canvas`, etc.); use at most one instance per page unless those ids are duplicated or renamed.
