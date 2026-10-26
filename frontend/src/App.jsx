import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createTask, deleteTask, listTasks, updateTask } from './api.js';
import { sortTasks } from './utils.js';
import useDebounce from './hooks/useDebounce.js';
import TaskItem from './components/TaskItem.jsx';
import TaskModal from './components/TaskModal.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [totals, setTotals] = useState({ total: 0, completed: 0 });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | { task? }
  const abortRef = useRef(null);

  const load = useCallback(async (term) => {
    abortRef.current?.abort(); // descarta resposta de busca anterior
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const data = await listTasks(term, controller.signal);
      setTasks(data.tasks);
      setTotals({ total: data.total, completed: data.completed });
      setError('');
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('Could not reach the server. Check that the backend is running.');
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, []);

  // Dispara apenas quando o usuário para de digitar (debounce).
  useEffect(() => { load(debouncedSearch); }, [debouncedSearch, load]);

  const sorted = useMemo(() => sortTasks(tasks), [tasks]);

  async function handleToggle(task) {
    const next = !task.completed;
    const previous = { tasks, totals };
    // atualização otimista
    setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, completed: next ? 1 : 0 } : t)));
    setTotals((t) => ({ ...t, completed: t.completed + (next ? 1 : -1) }));
    try {
      await updateTask(task.id, { completed: next });
    } catch (err) {
      setTasks(previous.tasks);
      setTotals(previous.totals);
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    try {
      await deleteTask(task.id);
      await load(debouncedSearch);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(values) {
    if (modal?.task) await updateTask(modal.task.id, values);
    else await createTask(values);
    setModal(null);
    await load(debouncedSearch);
  }

  const closeModal = useCallback(() => setModal(null), []);
  const searching = debouncedSearch.trim() !== '';

  return (
    <div className="page">
      <main className="card">
        <header className="header">
          <h1>Todo List</h1>
          <p className="counters">
            <span><strong>{totals.total}</strong> total</span>
            <span className="dot" aria-hidden="true" />
            <span><strong>{totals.completed}</strong> completed</span>
          </p>
        </header>

        <div className="search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
            aria-label="Search tasks"
          />
        </div>

        {error && (
          <div className="alert" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} aria-label="Dismiss">×</button>
          </div>
        )}

        {loading ? (
          <p className="empty">Loading…</p>
        ) : sorted.length === 0 ? (
          <div className="empty">
            <p className="empty-title">{searching ? 'No tasks match your search.' : 'You have no pending tasks.'}</p>
          </div>
        ) : (
          <ul className="list">
            {sorted.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={(t) => setModal({ task: t })}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        )}
      </main>

      <button type="button" className="fab" onClick={() => setModal({})} aria-label="Create task">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {modal && <TaskModal task={modal.task} onClose={closeModal} onSubmit={handleSubmit} />}
    </div>
  );
}
