import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { taskService } from "../services/taskService";
import { habitService } from "../services/habitService";
import { SkeletonGrid } from "../components/ui/Skeleton";
import { PRIORITIES } from "../utils/constants";
import { getErrorMessage } from "../utils/helpers";
import { format, subDays } from "date-fns";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [taskRes, habitRes] = await Promise.all([
          taskService.getTasks({ limit: 500 }),
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

  // Last 7 days completion counts (client-side aggregation from completedAt)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const key = format(date, "yyyy-MM-dd");
    const count = tasks.filter(
      (t) => t.completed && t.completedAt && format(new Date(t.completedAt), "yyyy-MM-dd") === key
    ).length;
    return { day: format(date, "EEE"), completed: count };
  });

  const priorityData = PRIORITIES.map((p) => ({
    name: p.label,
    value: tasks.filter((t) => t.priority === p.value).length,
    color: p.color,
  }));

  const streakTrend = habits
    .slice(0, 5)
    .map((h) => ({ name: h.name.slice(0, 10), streak: h.currentStreak }));

  if (loading) return <SkeletonGrid count={4} />;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-ink-900/45 dark:text-white/35">
          A look at how the week is going.
        </p>
      </div>

      {tasks.length === 0 && habits.length === 0 ? (
        <div className="glass-panel flex flex-col items-center py-16 text-center">
          <BarChart3 className="mb-3 h-8 w-8 text-ink-900/20 dark:text-white/20" />
          <p className="text-sm text-ink-900/50 dark:text-white/40">
            Add some tasks and habits to see your analytics here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="glass-panel p-5">
            <h2 className="mb-4 font-display text-sm font-semibold text-ink-900 dark:text-white">
              Tasks completed — last 7 days
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: "rgba(124,92,252,0.06)" }} />
                <Bar dataKey="completed" fill="#7C5CFC" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-5">
            <h2 className="mb-4 font-display text-sm font-semibold text-ink-900 dark:text-white">
              Tasks by priority
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {priorityData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-5 lg:col-span-2">
            <h2 className="mb-4 font-display text-sm font-semibold text-ink-900 dark:text-white">
              Current streaks by habit
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={streakTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="streak"
                  stroke="#FB7A3B"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#FB7A3B" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
