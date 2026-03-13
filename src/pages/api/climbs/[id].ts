import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

function checkAuth(request: Request, password: string): boolean {
  return request.headers.get('Authorization') === `Bearer ${password}`;
}

export const PUT: APIRoute = async ({ params, request }) => {
  const { DB, ADMIN_PASSWORD } = env as unknown as { DB: D1Database; ADMIN_PASSWORD: string };
  if (!checkAuth(request, ADMIN_PASSWORD)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json() as any;

  await DB.prepare(
    'UPDATE climbs SET grade=?, color=?, tags=?, date=?, location=?, notes=?, images=? WHERE id=?'
  ).bind(
    body.grade,
    body.color,
    JSON.stringify(body.tags ?? []),
    body.date,
    body.location ?? '',
    body.notes ?? '',
    JSON.stringify(body.images ?? []),
    params.id,
  ).run();

  return new Response(JSON.stringify({ id: params.id, ...body }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const { DB, ADMIN_PASSWORD } = env as unknown as { DB: D1Database; ADMIN_PASSWORD: string };
  if (!checkAuth(request, ADMIN_PASSWORD)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  await DB.prepare('DELETE FROM climbs WHERE id=?').bind(params.id).run();
  return new Response(null, { status: 204 });
};
