export const SkeletonLine = ({ className = "h-4 w-full" }) => (
  <div className={`skeleton ${className}`} />
);

export const SkeletonCard = () => (
  <div className="glass-panel p-5">
    <div className="mb-3 flex items-center justify-between">
      <SkeletonLine className="h-4 w-1/3" />
      <SkeletonLine className="h-6 w-6 rounded-full" />
    </div>
    <SkeletonLine className="mb-2 h-3 w-full" />
    <SkeletonLine className="h-3 w-2/3" />
  </div>
);

export const SkeletonGrid = ({ count = 4 }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonRows = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass-panel flex items-center gap-4 p-4">
        <SkeletonLine className="h-5 w-5 rounded-md" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="h-3.5 w-1/2" />
          <SkeletonLine className="h-3 w-1/4" />
        </div>
      </div>
    ))}
  </div>
);
