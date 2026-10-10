import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Plus, ListChecks, ChevronLeft, ChevronRight } from "lucide-react";
import { taskService } from "../services/taskService";
import TaskCard from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";
import TaskFilters from "../components/tasks/TaskFilters";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonRows } from "../components/ui/Skeleton";
import { useDebounce } from "../hooks/useDebounce";
import { getErrorMessage } from "../utils/helpers";
import { TASKS_PAGE_SIZE } from "../utils/constants";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    completed: "",
    sortBy: "createdAt",
    order: "desc",
  });
  const debouncedSearch = useDebounce(filters.search, 400);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await taskService.getTasks({
          ...filters,
          search: debouncedSearch,
          page,
          limit: TASKS_PAGE_SIZE,
        });
        setTasks(res.tasks);
        setPagination({ page: res.page, pages: res.pages, total: res.total });
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [filters.priority, filters.completed, filters.sortBy, filters.order, debouncedSearch]
  );

  useEffect(() => {
    fetchTasks(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.priority, filters.completed, filters.sortBy, filters.order, debouncedSearch]);

  const openCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, data);
        toast.success("Task updated");
      } else {
        await taskService.createTask(data);
        toast.success("Task created");
      }
      setFormOpen(false);
      fetchTasks(pagination.page);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (task) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await taskService.toggleComplete(task._id, !task.completed);
    } catch (error) {
      toast.error(getErrorMessage(error));
      fetchTasks(pagination.page);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await taskService.deleteTask(deleteTarget._id);
      toast.success("Task deleted");
      setDeleteTarget(null);
      fetchTasks(pagination.page);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Tasks</h1>
          <p className="mt-1 text-sm text-ink-900/45 dark:text-white/35">
            {pagination.total} total
          </p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          New task
        </Button>
      </div>

      <div className="mb-5">
        <TaskFilters filters={filters} onChange={setFilters} />
      </div>

      {loading ? (
        <SkeletonRows count={5} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks found"
          description="Try adjusting your filters, or create your first task."
          action={
            <Button icon={Plus} onClick={openCreate}>
              New task
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={handleToggle}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchTasks(pagination.page - 1)}
                className="rounded-lg p-2 text-ink-900/50 hover:bg-ink-900/[0.06] disabled:opacity-30 dark:text-white/40 dark:hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium text-ink-900/60 dark:text-white/50">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                disabled={pagination.page >= pagination.pages}
                onClick={() => fetchTasks(pagination.page + 1)}
                className="rounded-lg p-2 text-ink-900/50 hover:bg-ink-900/[0.06] disabled:opacity-30 dark:text-white/40 dark:hover:bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingTask ? "Edit task" : "New task"}
      >
        <TaskForm
          defaultValues={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete task"
        description={`"${deleteTarget?.title}" will be permanently deleted. This can't be undone.`}
      />
    </div>
  );
};

export default Tasks;
