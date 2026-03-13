// ── Data model ──────────────────────────────────────────────────────────────

export interface ClimbingLog {
  id: string;
  grade: string;
  color: string;
  tags: string[];
  date: string;
  location: string;
  notes: string;
  images: string[];
}

// ── Constants ───────────────────────────────────────────────────────────────

export const GRADES = [
  'VB','V0','V1','V2','V3','V4','V5','V6','V7','V8',
  'V9','V10','V11','V12','V13','V14','V15','V16','V17',
];

export const HOLD_COLORS = [
  'Red','Blue','Green','Yellow','Orange','Purple','Pink','White','Black',
];

export const TAGS = [
  'Crimps','Jugs','Slopers','Pinches','Pockets',
  'Dyno','Slab','Overhang','Roof','Mantle',
  'Heel Hook','Toe Hook','Crack','Arete','Compression',
  'Smear','Stem','Knee Bar','Comp',
];

export const COLOR_HEX: Record<string, string> = {
  Red:    '#ef4444',
  Blue:   '#3b82f6',
  Green:  '#22c55e',
  Yellow: '#eab308',
  Orange: '#f97316',
  Purple: '#a855f7',
  Pink:   '#ec4899',
  White:  '#d1d5db',
  Black:  '#6b7280',
};

// ── API client ──────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const token = sessionStorage.getItem('admin-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchLogs(): Promise<ClimbingLog[]> {
  const res = await fetch('/api/climbs');
  if (!res.ok) return [];
  return res.json();
}

export async function createLog(log: Omit<ClimbingLog, 'id'>): Promise<ClimbingLog> {
  const res = await fetch('/api/climbs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(log),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateLog(id: string, log: Omit<ClimbingLog, 'id'>): Promise<ClimbingLog> {
  const res = await fetch(`/api/climbs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(log),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteLog(id: string): Promise<void> {
  const res = await fetch(`/api/climbs/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status === 401) throw new Error('Unauthorized');
  if (!res.ok) throw new Error('Failed to delete');
}

export async function verifyPassword(password: string): Promise<boolean> {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return res.ok;
}

// ── Utilities (unchanged, run client-side) ──────────────────────────────────

export function gradeToNumber(grade: string): number {
  return grade === 'VB' ? -1 : parseInt(grade.replace('V', ''), 10);
}

export function numberToGrade(n: number): string {
  return n === -1 ? 'VB' : `V${n}`;
}

export function resizeImage(file: File, maxWidth = 600): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxWidth) { h = (h * maxWidth) / w; w = maxWidth; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function linearRegression(points: { x: number; y: number }[]) {
  if (points.length < 2) return null;
  const n = points.length;
  let sx = 0, sy = 0, sxy = 0, sx2 = 0;
  for (const p of points) { sx += p.x; sy += p.y; sxy += p.x * p.y; sx2 += p.x * p.x; }
  const d = n * sx2 - sx * sx;
  if (d === 0) return null;
  return { slope: (n * sxy - sx * sy) / d, intercept: (sy - ((n * sxy - sx * sy) / d) * sx) / n };
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
