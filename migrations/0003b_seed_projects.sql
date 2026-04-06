INSERT OR IGNORE INTO projects (id, title, description, github_url, is_private, demo_url, demo_label, sort_order) VALUES
  (
    'proj001',
    'ViT Attention Visualization',
    'Personal learning project exploring how Vision Transformers "see" images by visualizing attention maps (last-layer and rollout) across 100 COCO images spanning cats, horses, cars, and bicycles. Uses google/vit-large-patch16-224 (307M params).',
    'https://github.com/jayjanii/attention-visualization',
    0,
    '/attention',
    'View Write-up',
    1
  ),
  (
    'proj002',
    'N-Body Gravitational Simulator',
    'Real-time N-body gravitational simulation built with OpenGL 3.3 Core Profile. Uses a symplectic Velocity Verlet integrator for long-term energy conservation. The Solar System scenario uses real J2000 Keplerian orbital elements for accurate elliptical orbits with true 3D inclinations.',
    'https://github.com/jayjanii/n-body-sim',
    0,
    '/nbody',
    'View Web Demo',
    2
  ),
  (
    'proj003',
    'Personal Website',
    'This site: a personal developer portfolio built with Astro and deployed on Cloudflare Pages. Includes a full-stack climbing log that lets me track and review my climbing sessions, backed by a Cloudflare D1 (SQLite) database with a password-protected admin API.',
    '',
    1,
    '',
    '',
    3
  );
