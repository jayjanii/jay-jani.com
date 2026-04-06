import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

import { checkAdminAuth } from '../../../lib/server/auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  const { DB } = env as unknown as { DB: D1Database };
  const { results } = await DB.prepare('SELECT * FROM climbs ORDER BY date DESC').all();

  const logs = (results ?? []).map((r: any) => ({
    id: r.id,
    grade: r.grade,
    color: r.color,
    tags: JSON.parse(r.tags),
    date: r.date,
    location: r.location,
    notes: r.notes,
    images: JSON.parse(r.images),
  }));

  return new Response(JSON.stringify(logs), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const { DB, ADMIN_PASSWORD } = env as unknown as { DB: D1Database; ADMIN_PASSWORD: string };
  if (!checkAdminAuth(request, ADMIN_PASSWORD)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json() as any;
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  await DB.prepare(
    'INSERT INTO climbs (id, grade, color, tags, date, location, notes, images) VALUES (?,?,?,?,?,?,?,?)'
  ).bind(
    id,
    body.grade,
    body.color,
    JSON.stringify(body.tags ?? []),
    body.date,
    body.location ?? '',
    body.notes ?? '',
    JSON.stringify(body.images ?? []),
  ).run();

  return new Response(JSON.stringify({ id, ...body }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
