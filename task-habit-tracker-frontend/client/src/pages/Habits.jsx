import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Flame } from "lucide-react";
import { habitService } from "../services/habitService";
import HabitCard from "../components/habits/HabitCard";
import HabitForm from "../components/habits/HabitForm";
import HabitCalendar from "../components/habits/HabitCalendar";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import StreakRing from "../components/ui/StreakRing";
import { SkeletonGrid } from "../components/ui/Skeleton";
import { getErrorMessage } from "../utils/helpers";

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [historyHabit, setHistoryHabit] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const res = await habitService.getHabits();
      setHabits(res.habits);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const openCreate = () => {
    setEditingHabit(null);
    setFormOpen(true);
  };

  const openEdit = (habit) => {
    setEditingHabit(habit);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingHabit) {
        await habitService.updateHabit(editingHabit._id, data);
        toast.success("Habit updated");
      } else {
        await habitService.createHabit(data);
        toast.success("Habit created");
      }
      setFormOpen(false);
      fetchHabits();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheck = async (habit) => {
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
      if (res.completedToday) toast.success(`${habit.name} checked in 🔥`);
    } catch (error) {
      toast.error(getErrorMessage(error));
      fetchHabits();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget._id || deleteTarget.id;
    setDeleting(true);
    try {
      await habitService.deleteHabit(targetId);
      setHabits((prev) => prev.filter((h) => (h._id || h.id) !== targetId));
      toast.success("Habit deleted");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const openHistory = async (habit) => {
    setHistoryHabit(habit);
    setHistoryLoading(true);
    try {
      const res = await habitService.getHistory(habit._id);
      setHistoryData(res);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Habits</h1>
          <p className="mt-1 text-sm text-ink-900/45 dark:text-white/35">
            {habits.length} active habit{habits.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          New habit
        </Button>
      </div>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : habits.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="No habits yet"
          description="Start with something small — a glass of water, ten pages, a short walk."
          action={
            <Button icon={Plus} onClick={openCreate}>
              Create your first habit
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onCheck={handleCheck}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              onOpenHistory={openHistory}
            />
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingHabit ? "Edit habit" : "New habit"}
      >
        <HabitForm
          defaultValues={editingHabit}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <Modal
        open={!!historyHabit}
        onClose={() => {
          setHistoryHabit(null);
          setHistoryData(null);
        }}
        title={historyHabit?.name || "History"}
      >
        {historyLoading ? (
          <div className="py-10 text-center text-sm text-ink-900/40 dark:text-white/30">
            Loading history...
          </div>
        ) : (
          historyData && (
            <div>
              <div className="mb-5 flex items-center justify-around">
                <div className="flex flex-col items-center gap-1.5">
                  <StreakRing value={historyData.habit.currentStreak} size={60} />
                  <span className="text-xs text-ink-900/45 dark:text-white/35">Current</span>
                </div>
                <div className="text-center">
                  <p className="font-mono text-2xl font-semibold text-ink-900 dark:text-white">
                    {historyData.habit.longestStreak}
                  </p>
                  <span className="text-xs text-ink-900/45 dark:text-white/35">Longest streak</span>
                </div>
                <div className="text-center">
                  <p className="font-mono text-2xl font-semibold text-ink-900 dark:text-white">
                    {historyData.completionRate}%
                  </p>
                  <span className="text-xs text-ink-900/45 dark:text-white/35">Completion rate</span>
                </div>
              </div>
              <HabitCalendar logs={historyData.logs} color={historyHabit?.color} />
            </div>
          )
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete habit"
        description={`"${deleteTarget?.name}" and all its history will be permanently deleted.`}
      />
    </div>
  );
};

export default Habits;
