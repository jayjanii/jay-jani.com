import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

function checkAuth(request: Request, password: string): boolean {
  return request.headers.get('Authorization') === `Bearer ${password}`;
}

export const GET: APIRoute = async () => {
  const { DB } = env as unknown as { DB: D1Database };
  const { results } = await DB.prepare('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC').all();

  const projects = (results ?? []).map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    github_url: r.github_url,
    is_private: !!r.is_private,
    demo_url: r.demo_url,
    demo_label: r.demo_label,
    sort_order: r.sort_order,
  }));

  return new Response(JSON.stringify(projects), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const { DB, ADMIN_PASSWORD } = env as unknown as { DB: D1Database; ADMIN_PASSWORD: string };
  if (!checkAuth(request, ADMIN_PASSWORD)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json() as any;
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  await DB.prepare(
    'INSERT INTO projects (id, title, description, github_url, is_private, demo_url, demo_label, sort_order) VALUES (?,?,?,?,?,?,?,?)'
  ).bind(
    id,
    body.title,
    body.description ?? '',
    body.github_url ?? '',
    body.is_private ? 1 : 0,
    body.demo_url ?? '',
    body.demo_label ?? '',
    body.sort_order ?? 0,
  ).run();

  return new Response(JSON.stringify({ id, ...body }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
