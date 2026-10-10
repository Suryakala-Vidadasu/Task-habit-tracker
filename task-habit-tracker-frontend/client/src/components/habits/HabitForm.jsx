import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import * as Icons from "lucide-react";
import clsx from "clsx";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { FREQUENCIES, WEEKDAYS, HABIT_COLORS, HABIT_ICONS } from "../../utils/constants";

const HabitForm = ({ defaultValues, onSubmit, onCancel, submitting }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      name: "",
      goal: "",
      color: HABIT_COLORS[0],
      icon: "Star",
      reminderTime: "",
      frequency: "daily",
      weeklyDays: [],
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  const frequency = watch("frequency");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Habit name"
        placeholder="e.g. Morning run"
        error={errors.name?.message}
        {...register("name", { required: "Habit name is required" })}
      />

      <Input label="Goal (optional)" placeholder="e.g. 30 minutes" {...register("goal")} />

      <div>
        <label className="label-text">Icon</label>
        <Controller
          control={control}
          name="icon"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map((iconName) => {
                const IconComp = Icons[iconName];
                return (
                  <button
                    type="button"
                    key={iconName}
                    onClick={() => field.onChange(iconName)}
                    className={clsx(
                      "flex h-9 w-9 items-center justify-center rounded-lg border-2 transition-colors",
                      field.value === iconName
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-transparent bg-ink-900/[0.05] dark:bg-white/[0.06]"
                    )}
                  >
                    <IconComp className="h-4 w-4 text-ink-900/70 dark:text-white/70" />
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <div>
        <label className="label-text">Color</label>
        <Controller
          control={control}
          name="color"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {HABIT_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => field.onChange(c)}
                  style={{ backgroundColor: c }}
                  className={clsx(
                    "h-8 w-8 rounded-full ring-offset-2 ring-offset-white transition-all dark:ring-offset-ink-800",
                    field.value === c && "ring-2 ring-ink-900 dark:ring-white"
                  )}
                  aria-label={`Choose color ${c}`}
                />
              ))}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-text">Frequency</label>
          <select className="input-field" {...register("frequency")}>
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <Input label="Reminder time" type="time" {...register("reminderTime")} />
      </div>

      {frequency === "weekly" && (
        <div>
          <label className="label-text">Repeat on</label>
          <Controller
            control={control}
            name="weeklyDays"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((d) => {
                  const selected = field.value?.includes(d.value);
                  return (
                    <button
                      type="button"
                      key={d.value}
                      onClick={() =>
                        field.onChange(
                          selected
                            ? field.value.filter((v) => v !== d.value)
                            : [...(field.value || []), d.value]
                        )
                      }
                      className={clsx(
                        "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                        selected
                          ? "bg-brand-gradient text-white"
                          : "bg-ink-900/[0.05] text-ink-900/60 dark:bg-white/[0.06] dark:text-white/50"
                      )}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {defaultValues ? "Save changes" : "Create habit"}
        </Button>
      </div>
    </form>
  );
};

export default HabitForm;
