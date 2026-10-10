import { Search } from "lucide-react";
import { PRIORITIES } from "../../utils/constants";

const TaskFilters = ({ filters, onChange }) => {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="glass-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/40 dark:text-white/30" />
        <input
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search tasks..."
          className="input-field pl-10"
        />
      </div>

      <select
        value={filters.priority}
        onChange={(e) => update({ priority: e.target.value })}
        className="input-field sm:w-40"
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <select
        value={filters.completed}
        onChange={(e) => update({ completed: e.target.value })}
        className="input-field sm:w-40"
      >
        <option value="">All statuses</option>
        <option value="false">Active</option>
        <option value="true">Completed</option>
      </select>

      <select
        value={`${filters.sortBy}:${filters.order}`}
        onChange={(e) => {
          const [sortBy, order] = e.target.value.split(":");
          update({ sortBy, order });
        }}
        className="input-field sm:w-44"
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="createdAt:asc">Oldest first</option>
        <option value="dueDate:asc">Due date ↑</option>
        <option value="dueDate:desc">Due date ↓</option>
        <option value="priority:desc">Priority ↓</option>
      </select>
    </div>
  );
};

export default TaskFilters;
