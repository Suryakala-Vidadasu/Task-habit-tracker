import { useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

const HabitCalendar = ({ logs = [], color = "#7C5CFC" }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const loggedDates = useMemo(
    () => new Set(logs.map((l) => format(new Date(l.date), "yyyy-MM-dd"))),
    [logs]
  );

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          className="rounded-lg p-1.5 hover:bg-ink-900/[0.06] dark:hover:bg-white/10"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">
          {format(currentMonth, "MMMM yyyy")}
        </p>
        <button
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          className="rounded-lg p-1.5 hover:bg-ink-900/[0.06] dark:hover:bg-white/10"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[11px] font-semibold text-ink-900/35 dark:text-white/30">
            {d}
          </div>
        ))}
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const completed = loggedDates.has(key);
          const inMonth = isSameMonth(day, currentMonth);
          const today = isSameDay(day, new Date());

          return (
            <div
              key={key}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium mx-auto",
                !inMonth && "opacity-30",
                today && !completed && "ring-1 ring-violet-400"
              )}
              style={completed ? { backgroundColor: color, color: "#fff" } : undefined}
              title={key}
            >
              <span className={!completed ? "text-ink-900/60 dark:text-white/50" : ""}>
                {format(day, "d")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitCalendar;
