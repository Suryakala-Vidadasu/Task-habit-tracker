import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ListChecks,
  Flame,
  TrendingUp,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { taskService } from "../services/taskService";
import { habitService } from "../services/habitService";
import StatCard from "../components/dashboard/StatCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import StreakRing from "../components/ui/StreakRing";
import { SkeletonGrid, SkeletonRows } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { getGreeting, getErrorMessage, formatFriendlyDate } from "../utils/helpers";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [taskRes, habitRes] = await Promise.all([
          taskService.getTasks({ limit: 100, sortBy: "dueDate", order: "asc" }),
          habitService.getHabits(),
        ]);
        setTasks(taskRes.tasks);
        setHabits(habitRes.habits);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleHabit = async (habit) => {
    setHabits((prev) =>
      prev.map((h) => (h._id === habit._id ? { ...h, completedToday: !h.completedToday } : h))
    );
    try {
      const res = await habitService.checkHabit(habit._id);
      setHabits((prev) =>
        prev.map((h) =>
          h._id === habit._id
            ? {
                ...h,
                completedToday: res.completedToday,
                currentStreak: res.currentStreak,
                longestStreak: res.longestStreak,
              }
            : h
        )
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
      setHabits((prev) =>
        prev.map((h) => (h._id === habit._id ? { ...h, completedToday: habit.completedToday } : h))
      );
    }
  };

  const todaysTasks = tasks.filter((t) => !t.completed).slice(0, 5);
  const completedThisWeek = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const habitsCompletedToday = habits.filter((h) => h.completedToday).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.currentStreak || 0), 0);

  const recentActivity = [
    ...tasks
      .filter((t) => t.completed && t.completedAt)
      .map((t) => ({ id: t._id, type: "task", title: t.title, date: t.completedAt })),
    ...habits
      .filter((h) => h.completedToday)
      .map((h) => ({ id: h._id, type: "habit", title: h.name, date: new Date() })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink-900/45 dark:text-white/35">
            {formatFriendlyDate(new Date())} · {new Date().toLocaleDateString(undefined, { weekday: "long" })}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 sm:text-3xl dark:text-white">
            {getGreeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
        </div>
      </div>

      {loading ? (
        <>
          <SkeletonGrid count={4} />
          <div className="mt-6">
            <SkeletonRows count={4} />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Tasks pending" value={pendingTasks} icon={ListChecks} accent="violet" />
            <StatCard label="Completed" value={completedThisWeek} icon={CalendarCheck} accent="cyan" />
            <StatCard
              label="Habits done today"
              value={`${habitsCompletedToday}/${habits.length}`}
              icon={Flame}
              accent="ember"
            />
            <StatCard label="Best current streak" value={bestStreak} icon={TrendingUp} accent="emerald" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="glass-panel p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-semibold text-ink-900 dark:text-white">
                  Today's tasks
                </h2>
                <Link
                  to="/tasks"
                  className="flex items-center gap-1 text-xs font-semibold text-violet-500 hover:underline"
                >
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {todaysTasks.length === 0 ? (
                <EmptyState
                  icon={ListChecks}
                  title="All caught up"
                  description="You have no pending tasks. Enjoy the calm."
                />
              ) : (
                <ul className="space-y-1">
                  {todaysTasks.map((task) => (
                    <li
                      key={task._id}
                      className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-ink-900/[0.03] dark:hover:bg-white/[0.04]"
                    >
                      <span className="truncate text-sm font-medium text-ink-900 dark:text-white">
                        {task.title}
                      </span>
                      {task.dueDate && (
                        <span className="ml-3 shrink-0 text-xs text-ink-900/40 dark:text-white/30">
                          {formatFriendlyDate(task.dueDate)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="glass-panel p-5">
              <h2 className="mb-4 font-display text-base font-semibold text-ink-900 dark:text-white">
                Recent activity
              </h2>
              <RecentActivity items={recentActivity} />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink-900 dark:text-white">
                Today's habits
              </h2>
              <Link
                to="/habits"
                className="flex items-center gap-1 text-xs font-semibold text-violet-500 hover:underline"
              >
                Manage habits <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {habits.length === 0 ? (
              <EmptyState
                icon={Flame}
                title="No habits yet"
                description="Create your first habit to start building a streak."
                action={
                  <Link to="/habits" className="btn-primary">
                    Add a habit
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {habits.slice(0, 6).map((habit) => (
                  <button
                    key={habit._id}
                    onClick={() => toggleHabit(habit)}
                    className="glass-panel flex flex-col items-center gap-2 p-4 transition-transform hover:-translate-y-0.5"
                  >
                    <StreakRing value={habit.currentStreak} size={48} />
                    <span className="line-clamp-1 text-center text-xs font-medium text-ink-900/70 dark:text-white/60">
                      {habit.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
