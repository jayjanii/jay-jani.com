/** Types, labels, and browser client for `/api/papers`. */
export interface Paper {
  id: string;
  title: string;
  authors: string;
  url: string;
  year: string;
  status: string;
  tags: string[];
  notes: string;
  created_at?: string;
}

export const STATUSES = ['to-read', 'reading', 'read'] as const;

export const STATUS_LABELS: Record<string, string> = {
  'to-read': 'To Read',
  'reading': 'Reading',
  'read': 'Read',
};

export const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'to-read': { bg: 'bg-yellow-600/20', border: 'border-yellow-500/50', text: 'text-yellow-300' },
  'reading': { bg: 'bg-blue-600/20', border: 'border-blue-500/50', text: 'text-blue-300' },
  'read':    { bg: 'bg-green-600/20', border: 'border-green-500/50', text: 'text-green-300' },
};

export const TAGS = [
  'ML', 'NLP', 'CV', 'RL', 'Transformers', 'Diffusion',
  'Optimization', 'Theory', 'Robotics', 'Neuroscience',
  'Systems', 'Safety', 'Agents', 'Multimodal',
];

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchPapers(): Promise<Paper[]> {
  const res = await fetch('/api/papers');
  if (!res.ok) return [];
  return res.json();
}

export async function createPaper(paper: Omit<Paper, 'id'>): Promise<Paper> {
  const res = await fetch('/api/papers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(paper),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updatePaper(id: string, paper: Omit<Paper, 'id'>): Promise<Paper> {
  const res = await fetch(`/api/papers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(paper),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deletePaper(id: string): Promise<void> {
  const res = await fetch(`/api/papers/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to delete');
}

export async function suggestTags(title: string, authors: string): Promise<string[]> {
  const res = await fetch('/api/suggest-tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ title, authors }),
  });
  if (!res.ok) return [];
  const data = await res.json() as { tags: string[] };
  return data.tags ?? [];
}
