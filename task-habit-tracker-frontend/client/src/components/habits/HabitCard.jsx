import * as Icons from "lucide-react";
import { Pencil, Trash2, Trophy } from "lucide-react";
import clsx from "clsx";
import StreakRing from "../ui/StreakRing";

const HabitCard = ({ habit, onCheck, onEdit, onDelete, onOpenHistory }) => {
  const IconComp = Icons[habit.icon] || Icons.Star;

  return (
    <div className="glass-panel group relative overflow-hidden p-5 transition-transform duration-200 hover:-translate-y-0.5">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 blur-2xl"
        style={{ backgroundColor: habit.color }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${habit.color}1A` }}
          >
            <IconComp className="h-5 w-5" style={{ color: habit.color }} />
          </div>
          <div>
            <button
              onClick={() => onOpenHistory(habit)}
              className="text-left font-display text-sm font-semibold text-ink-900 hover:underline dark:text-white"
            >
              {habit.name}
            </button>
            <p className="text-xs capitalize text-ink-900/45 dark:text-white/40">
              {habit.frequency}
              {habit.goal ? ` · ${habit.goal}` : ""}
            </p>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            onClick={() => onEdit(habit)}
            aria-label="Edit habit"
            className="rounded-lg p-1.5 text-ink-900/40 hover:bg-ink-900/[0.06] hover:text-violet-500 dark:text-white/40 dark:hover:bg-white/10"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit);
            }}
            aria-label="Delete habit"
            className="rounded-lg p-1.5 text-ink-900/40 hover:bg-red-500/10 hover:text-red-500 dark:text-white/40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <StreakRing value={habit.currentStreak} max={30} size={52} />
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-900/50 dark:text-white/40">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            Best: {habit.longestStreak}
          </div>
        </div>

        <button
          onClick={() => onCheck(habit)}
          className={clsx(
            "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
            habit.completedToday
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-brand-gradient text-white shadow-glow hover:scale-[1.03]"
          )}
        >
          {habit.completedToday ? "Done today ✓" : "Mark done"}
        </button>
      </div>
    </div>
  );
};

export default HabitCard;
