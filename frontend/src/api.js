const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3333') + '/api/tasks';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let message = 'Something went wrong. Try again.';
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch { /* corpo vazio */ }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

// -> { tasks, total, completed }
export function listTasks(search = '', signal) {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(BASE + qs, { signal });
}

export const createTask = ({ title, dueDate }) =>
  request(BASE, { method: 'POST', body: JSON.stringify({ title, dueDate: dueDate || null }) });

export const updateTask = (id, changes) =>
  request(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(changes) });

export const deleteTask = (id) => request(`${BASE}/${id}`, { method: 'DELETE' });
