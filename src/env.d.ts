/// <reference path="../.astro/types.d.ts" />

// Cloudflare Workers env bindings used via `import { env } from "cloudflare:workers"`
interface CloudflareEnv {
  DB: D1Database;
  ADMIN_PASSWORD: string;
}

declare module 'cloudflare:workers' {
  const env: CloudflareEnv;
  export { env };
}
