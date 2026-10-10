import clsx from "clsx";

const StatCard = ({ label, value, icon: Icon, accent = "violet", trend }) => {
  const accents = {
    violet: "bg-violet-500/10 text-violet-500",
    cyan: "bg-cyan-500/10 text-cyan-500",
    ember: "bg-ember-500/10 text-ember-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
  };

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center justify-between">
        <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={clsx(
              "text-xs font-semibold",
              trend.startsWith("-") ? "text-red-500" : "text-emerald-500"
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 font-mono text-2xl font-semibold text-ink-900 dark:text-white">{value}</p>
      <p className="mt-0.5 text-xs font-medium text-ink-900/45 dark:text-white/40">{label}</p>
    </div>
  );
};

export default StatCard;
