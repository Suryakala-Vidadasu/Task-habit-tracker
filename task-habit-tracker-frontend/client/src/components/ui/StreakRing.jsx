import { Flame } from "lucide-react";

const StreakRing = ({ value = 0, max = 30, size = 56, strokeWidth = 5, showFlame = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / Math.max(max, 1), 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-ink-900/[0.07] dark:stroke-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
          stroke="url(#streak-gradient)"
        />
        <defs>
          <linearGradient id="streak-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9D5C" />
            <stop offset="100%" stopColor="#FB7A3B" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showFlame && <Flame className="h-3.5 w-3.5 text-ember-500" />}
        <span className="font-mono text-sm font-semibold leading-none text-ink-900 dark:text-white">
          {value}
        </span>
      </div>
    </div>
  );
};

export default StreakRing;
