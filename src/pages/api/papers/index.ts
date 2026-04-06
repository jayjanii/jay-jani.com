import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

function checkAuth(request: Request, password: string): boolean {
  return request.headers.get('Authorization') === `Bearer ${password}`;
}

export const GET: APIRoute = async () => {
  const { DB } = env as unknown as { DB: D1Database };
  const { results } = await DB.prepare('SELECT * FROM papers ORDER BY created_at DESC').all();

  const papers = (results ?? []).map((r: any) => ({
    id: r.id,
    title: r.title,
    authors: r.authors,
    url: r.url,
    year: r.year,
    status: r.status,
    tags: JSON.parse(r.tags),
    notes: r.notes,
  }));

  return new Response(JSON.stringify(papers), {
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
    'INSERT INTO papers (id, title, authors, url, year, status, tags, notes) VALUES (?,?,?,?,?,?,?,?)'
  ).bind(
    id,
    body.title,
    body.authors ?? '',
    body.url ?? '',
    body.year ?? '',
    body.status ?? 'to-read',
    JSON.stringify(body.tags ?? []),
    body.notes ?? '',
  ).run();

  return new Response(JSON.stringify({ id, ...body }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
