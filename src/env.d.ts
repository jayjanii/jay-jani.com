/// <reference path="../.astro/types.d.ts" />

/** D1 + secrets available on Workers (API routes). Set `ADMIN_PASSWORD` in Cloudflare / `.dev.vars`. */
interface CloudflareEnv {
  DB: D1Database;
  ADMIN_PASSWORD: string;
}

declare module 'cloudflare:workers' {
  const env: CloudflareEnv;
  export { env };
}
