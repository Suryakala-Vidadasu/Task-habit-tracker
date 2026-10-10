import { Calendar, Pencil, Trash2, Tag } from "lucide-react";
import clsx from "clsx";
import Badge from "../ui/Badge";
import { PRIORITIES } from "../../utils/constants";
import { formatFriendlyDate, isOverdue } from "../../utils/helpers";

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => {
  const priority = PRIORITIES.find((p) => p.value === task.priority) || PRIORITIES[1];
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <div className="glass-panel group flex items-start gap-4 p-4 transition-transform duration-200 hover:-translate-y-0.5">
      <button
        onClick={() => onToggle(task)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        className={clsx(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
          task.completed
            ? "border-violet-500 bg-brand-gradient"
            : "border-ink-900/20 hover:border-violet-500 dark:border-white/20"
        )}
      >
        {task.completed && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 fill-none stroke-white stroke-[2.5]">
            <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={clsx(
            "truncate text-sm font-semibold text-ink-900 dark:text-white",
            task.completed && "text-ink-900/40 line-through dark:text-white/30"
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-ink-900/50 dark:text-white/40">
            {task.description}
          </p>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <Badge color={priority.color}>{priority.label}</Badge>
          {task.dueDate && (
            <Badge
              color={overdue ? "#EF4444" : undefined}
              className={!overdue ? "bg-ink-900/[0.05] text-ink-900/60 dark:bg-white/[0.06] dark:text-white/50" : ""}
            >
              <Calendar className="h-3 w-3" />
              {formatFriendlyDate(task.dueDate)}
              {overdue && " · Overdue"}
            </Badge>
          )}
          {task.tags?.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              className="bg-ink-900/[0.05] text-ink-900/60 dark:bg-white/[0.06] dark:text-white/50"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <button
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="rounded-lg p-1.5 text-ink-900/40 hover:bg-ink-900/[0.06] hover:text-violet-500 dark:text-white/40 dark:hover:bg-white/10"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="rounded-lg p-1.5 text-ink-900/40 hover:bg-red-500/10 hover:text-red-500 dark:text-white/40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
