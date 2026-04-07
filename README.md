# [jay-jani.com](https://jay-jani.com)

A personal site built with Astro and deployed on Cloudflare Pages, with a few interactive pages (N-body simulation, attention visualization) and small CRUD-style sections backed by Cloudflare D1.

### Stack

- **UI & routing**: [Astro](https://astro.build) 6 (`src/pages`, shared shell in `src/layouts/Layout.astro`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) 4 (`@tailwindcss/vite`, tokens in `src/styles/global.css`)
- **Hosting & API**: [Cloudflare Pages](https://pages.cloudflare.com) + [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) (API routes are Workers handlers; `prerender = false`)
- **Data**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite), schema/seeds in `migrations/`
- **Graphics**: [Three.js](https://threejs.org) (N-body sim), [Chart.js](https://www.chartjs.org/) (attention viz)

### Pages

- **`/`**: profile + project cards from D1 (`src/pages/index.astro`)
- **`/nbody`**: full N-body sim (`src/pages/nbody.astro`)
- **`/attention`**: ViT attention article + charts (`src/pages/attention.astro`)
- **`/climbing` + `/climbing/admin`**: bouldering log + admin (`src/pages/climbing/*.astro`)
- **`/reading` + `/reading/admin`**: reading list + admin (`src/pages/reading/*.astro`)
- **`/projects/admin`**: edit homepage projects (`src/pages/projects/admin.astro`)

Admin screens share the same password gate and `localStorage` token pattern as the other admin UIs.

### HTTP API

- **`POST /api/auth`**: body `{ password }`, compares to server `ADMIN_PASSWORD` (returns token)
- **Public reads**: `GET /api/climbs`, `GET /api/papers`, `GET /api/projects` (and `/[id]`)
- **Admin writes**: `POST`/`PUT`/`DELETE` on the same resources require `Authorization: Bearer …`

Shared Bearer validation lives in `src/lib/server/auth.ts`. Browser helpers that call these APIs are `src/lib/climbing.ts`, `reading.ts`, and `projects.ts` (plus `verifyPassword` in `climbing.ts` used across admin pages).

### D1 tables

- **`climbs`**: log entries (grade, holds, date, notes, images, tags)
- **`papers`**: reading list (title, authors, URL, status, tags, notes)
- **`projects`**: homepage cards (title, copy, links, sort order)

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