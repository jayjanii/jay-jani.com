import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { checkAdminAuth } from '../../lib/server/auth';

export const prerender = false;

const PRESET_TAGS = [
  'ML', 'NLP', 'CV', 'RL', 'Transformers', 'Diffusion',
  'Optimization', 'Theory', 'Robotics', 'Neuroscience',
  'Systems', 'Safety', 'Agents', 'Multimodal',
];

export const POST: APIRoute = async ({ request }) => {
  const { AI, ADMIN_PASSWORD } = env as unknown as { AI: Ai; ADMIN_PASSWORD: string };

  if (!checkAdminAuth(request, ADMIN_PASSWORD)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { title, authors } = await request.json() as { title?: string; authors?: string };
  if (!title) {
    return new Response(JSON.stringify({ error: 'Title is required' }), { status: 400 });
  }

  const prompt = `You are a research paper classifier. Given a paper's title and authors, suggest 1-4 short tags that best describe the paper's topic.

Prefer tags from this list when they apply: ${PRESET_TAGS.join(', ')}

If none of those fit well, you may add 1-2 short custom tags (1-2 words, title-cased, e.g. "Graph Neural Nets", "RLHF", "Robotics").

Paper title: "${title}"${authors ? `\nAuthors: ${authors}` : ''}

Reply with ONLY a JSON array of strings. Example: ["ML", "Transformers", "RLHF"]`;

  try {
    const result = await AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    }) as { response: string };

    const match = result.response.match(/\[.*?\]/s);
    if (!match) {
      return new Response(JSON.stringify({ tags: [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsed: unknown = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) {
      return new Response(JSON.stringify({ tags: [] }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tags = (parsed as unknown[])
      .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      .map(t => t.trim())
      .slice(0, 4);

    return new Response(JSON.stringify({ tags }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'AI inference failed' }), { status: 502 });
  }
};
