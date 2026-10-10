import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { PRIORITIES } from "../../utils/constants";

const TaskForm = ({ defaultValues, onSubmit, onCancel, submitting }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
      tags: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        dueDate: defaultValues.dueDate ? defaultValues.dueDate.slice(0, 10) : "",
        tags: (defaultValues.tags || []).join(", "),
      });
    }
  }, [defaultValues, reset]);

  const submit = (data) => {
    onSubmit({
      ...data,
      tags: data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      dueDate: data.dueDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="e.g. Finish quarterly report"
        error={errors.title?.message}
        {...register("title", { required: "Title is required" })}
      />

      <div>
        <label className="label-text">Description</label>
        <textarea
          rows={3}
          placeholder="Add more detail (optional)"
          className="input-field resize-none"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-text">Priority</label>
          <select className="input-field" {...register("priority")}>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <Input label="Due date" type="date" {...register("dueDate")} />
      </div>

      <Input label="Tags" placeholder="work, urgent (comma separated)" {...register("tags")} />

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {defaultValues ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
