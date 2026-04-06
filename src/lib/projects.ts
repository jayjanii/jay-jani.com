/** Types and browser client for `/api/projects` (homepage cards + admin). */
export interface Project {
  id: string;
  title: string;
  description: string;
  github_url: string;
  is_private: boolean;
  demo_url: string;
  demo_label: string;
  sort_order: number;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) return [];
  return res.json();
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(project),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateProject(id: string, project: Omit<Project, 'id'>): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(project),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to delete');
}
