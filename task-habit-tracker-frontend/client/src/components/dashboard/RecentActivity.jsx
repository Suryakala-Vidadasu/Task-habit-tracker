import { CheckCircle2, Flame } from "lucide-react";
import { formatFriendlyDate } from "../../utils/helpers";
import EmptyState from "../ui/EmptyState";

const RecentActivity = ({ items = [] }) => {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="No activity yet"
        description="Complete a task or check in on a habit to see it here."
      />
    );
  }

  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <li
          key={`${item.type}-${item.id}`}
          className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-ink-900/[0.03] dark:hover:bg-white/[0.04]"
        >
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              item.type === "habit" ? "bg-ember-500/10 text-ember-500" : "bg-violet-500/10 text-violet-500"
            }`}
          >
            {item.type === "habit" ? <Flame className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-900 dark:text-white">{item.title}</p>
            <p className="text-xs text-ink-900/40 dark:text-white/35">
              {item.type === "habit" ? "Habit checked in" : "Task completed"}
            </p>
          </div>
          <span className="shrink-0 text-xs text-ink-900/35 dark:text-white/30">
            {formatFriendlyDate(item.date)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default RecentActivity;
