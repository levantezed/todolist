// Data local de hoje no formato YYYY-MM-DD (mesmo formato do due_date do backend).
export function todayStr() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// Atrasada: data limite já passou e a tarefa ainda está pendente.
export function isOverdue(task) {
  return !task.completed && !!task.due_date && task.due_date.slice(0, 10) < todayStr();
}

export function formatDate(str) {
  const [y, m, d] = str.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR');
}

// Data mais próxima primeiro; sem data vai para o fim; empate -> mais recente primeiro.
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.due_date && b.due_date) {
      const diff = a.due_date.localeCompare(b.due_date);
      if (diff !== 0) return diff;
    } else if (a.due_date) return -1;
    else if (b.due_date) return 1;
    return b.created_at.localeCompare(a.created_at);
  });
}
