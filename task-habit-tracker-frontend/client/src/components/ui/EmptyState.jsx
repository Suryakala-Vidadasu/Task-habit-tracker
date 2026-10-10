const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-ink-900/10 py-16 text-center dark:border-white/10">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient/10">
          <Icon className="h-6 w-6 text-violet-500" />
        </div>
      )}
      <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">
        {title}
      </h3>
      {description && (
        <p className="mx-auto mt-1.5 max-w-xs text-sm text-ink-900/50 dark:text-white/40">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
