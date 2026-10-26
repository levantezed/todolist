import { formatDate, isOverdue } from '../utils.js';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);
  const done = !!task.completed;

  return (
    <li className={`task ${done ? 'is-done' : ''}`}>
      <label className="check">
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle(task)}
          aria-label={`Mark "${task.title}" as ${done ? 'pending' : 'completed'}`}
        />
        <span className="check-box" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </label>

      <div className="task-body">
        <span className={`task-title ${overdue ? 'is-overdue' : ''}`}>{task.title}</span>
        {(task.due_date || overdue) && (
          <span className="task-meta">
            {task.due_date && <span className="task-date">{formatDate(task.due_date)}</span>}
            {overdue && <span className="badge">Em atraso</span>}
          </span>
        )}
      </div>

      <div className="task-actions">
        <button type="button" className="icon-btn" onClick={() => onEdit(task)} aria-label={`Edit "${task.title}"`}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
        <button type="button" className="icon-btn danger" onClick={() => onDelete(task)} aria-label={`Delete "${task.title}"`}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      </div>
    </li>
  );
}
