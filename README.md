# real-personal — Agent-Oriented Project Overview

This document helps agentic AI (and humans) understand the project structure, conventions, and where to make changes.

---

## Project Summary

- **Type:** Static personal portfolio site with interactive 3D demos.
- **Framework:** [Astro](https://astro.build) v6 (file-based routing, zero JS by default, islands for client interactivity).
- **Styling:** [Tailwind CSS](https://tailwindcss.com) v4 via `@tailwindcss/vite`.
- **3D:** [Three.js](https://threejs.org) for in-browser N-body gravity simulations.
- **Runtime:** Node `>=22.12.0` (see `package.json` engines).

Output is static HTML/CSS/JS; no backend or CMS.

---

## Repository Layout

```
real-personal/
├── astro.config.mjs       # Astro + Tailwind Vite plugin
├── package.json
├── src/
│   ├── components/        # Reusable .astro components (can contain <script> for client JS)
│   │   ├── GravitySim.astro   # Main N-body sim (Three.js + Web Worker)
│   │   └── NBodySim.astro     # Alternate/legacy N-body sim (not currently used in routes)
│   ├── layouts/
│   │   └── Layout.astro   # Base HTML shell, imports global.css, <slot /> for page content
│   ├── pages/             # File-based routes: index.astro → /, nbody.astro → /nbody
│   │   ├── index.astro    # Home: profile + project cards; embeds GravitySim (no controls)
│   │   └── nbody.astro    # Full N-body demo page; GravitySim with controls
│   └── styles/
│       └── global.css     # Tailwind @import + theme + body defaults
├── public/                # Static assets (favicon, etc.) — if present
└── dist/                  # Build output (astro build)
```

---

## Conventions

### Pages

- **Location:** `src/pages/*.astro`. File name = route path (`index.astro` → `/`, `nbody.astro` → `/nbody`).
- **Pattern:** Frontmatter (`---`) imports `Layout` and any components; the rest is layout + content.
- **Layout:** Every page wraps content in `<Layout title="...">`. The layout provides `<html>`, `<head>`, `<body>`, and a `<main>` with `<slot />`.

### Layout

- **File:** `src/layouts/Layout.astro`.
- **Props:** `title?: string` (default `"Portfolio"`).
- **Global styles:** Layout imports `../styles/global.css` (Tailwind + theme). Do not duplicate this in pages.

### Components

- **Location:** `src/components/*.astro`.
- **Usage:** Import in a page frontmatter and use as `<ComponentName />`. Props are typed in the component’s frontmatter `interface Props`.
- **Client interactivity:** Use a `<script>` block inside the component. Astro bundles and runs it on the client; no `client:*` directive is used in this project.

### Styling

- **Tailwind v4:** Configured in `astro.config.mjs` via `@tailwindcss/vite`. Use utility classes in markup.
- **Theme:** `src/styles/global.css` uses `@theme { --color-brand: #ff4500; }` and sets `body` background `#0f0f0f`, color `#ededed`, monospace font.
- **Design:** Dark theme, gray/blue accents, responsive (e.g. `md:flex-row`, `max-w-3xl`).

### Three.js / Simulation

- **Primary component:** `GravitySim.astro` — canvas + optional controls; physics run in an inline Web Worker (Velocity Verlet); Three.js for scene, camera, renderer, custom shaders (grid, particles), trails, and orbit controls (drag/zoom).
- **Props:** `controls?: boolean` — when `true`, shows sliders (bodies, G, dt) and Reset; when `false`, only the canvas (e.g. on homepage card).
- **Legacy:** `NBodySim.astro` is a different, class-based N-body implementation; it is **not** referenced by any page. Prefer extending or linking `GravitySim` for N-body features.

---

## Scripts (package.json)

| Command   | Purpose                    |
|----------|----------------------------|
| `npm run dev`     | Dev server (e.g. `http://localhost:4321`) |
| `npm run build`   | Production build → `dist/` |
| `npm run preview` | Serve `dist/` locally      |

---

## Where to Change What

| Goal | Where to look / what to do |
|------|----------------------------|
| Add a new page/route | Add `src/pages/<name>.astro`, use `Layout` and link from existing pages (e.g. index). |
| Change site title, meta, or global structure | `src/layouts/Layout.astro`. |
| Change global colors/fonts | `src/styles/global.css` and Tailwind classes in Layout. |
| Edit homepage profile or project list | `src/pages/index.astro` (profile-only, no embedded simulation). |
| Change N-body demo behavior or UI | `src/components/GravitySim.astro` (worker, Three.js scene, shaders, controls). |
| Add a reusable UI block | New `src/components/<Name>.astro`; import and use in pages. |
| Add static assets | `public/`; reference by path like `/favicon.svg`. |

---

## Technical Notes for Agents

1. **No `client:load` etc.** Components that need to run in the browser use a plain `<script>` inside the `.astro` file; Astro injects it once per component instance.
2. **GravitySim DOM IDs:** The component uses fixed IDs (`gravity-sim-container`, `gravity-canvas`, `gravity-controls`, `sim-n`, etc.). Avoid reusing these IDs elsewhere on the same page if you duplicate the component.
3. **Worker:** The physics worker is inlined as a string in `GravitySim.astro`, turned into a `Blob` and `Worker(URL.createObjectURL(blob))`. Changing N or integrator requires editing that string and the `postMessage`/`onmessage` contract.
4. **Sun rendering:** The sun is a Three.js `Mesh` (SphereGeometry) with a custom emissive rim shader, plus an additive-blended `Sprite` for the glow corona. It scales naturally with perspective/zoom unlike the old point-sprite approach.
5. **Planet rendering:** Planets are `THREE.Points` with a custom shader that uses perspective-correct `gl_PointSize` (scales with FOV) and view-space Blinn-Phong lighting from the sun position.
6. **Build:** No environment variables or secrets are required for `astro build`. The site is static.

---

## Quick Reference: Key Files

- **Entry routes:** `src/pages/index.astro`, `src/pages/nbody.astro`
- **Shell:** `src/layouts/Layout.astro`
- **Main 3D demo:** `src/components/GravitySim.astro`
- **Styles:** `src/styles/global.css`
- **Config:** `astro.config.mjs`, `package.json`
