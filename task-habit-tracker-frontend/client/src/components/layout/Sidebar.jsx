import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  LayoutDashboard,
  ListChecks,
  Flame,
  BarChart3,
  UserCircle,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/habits", label: "Habits", icon: Flame },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-ink-900/[0.06] bg-white/80 backdrop-blur-xl transition-transform duration-300 dark:border-white/[0.06] dark:bg-ink-900/80",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
              <Flame className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-bold text-ink-900 dark:text-white">
              Momentum
            </span>
          </a>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-900/50 hover:bg-ink-900/[0.06] lg:hidden dark:text-white/50 dark:hover:bg-white/10"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-brand-gradient text-white shadow-glow"
                    : "text-ink-900/60 hover:bg-ink-900/[0.05] hover:text-ink-900 dark:text-white/50 dark:hover:bg-white/[0.06] dark:hover:text-white"
                )
              }
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-900/[0.06] p-4 text-center text-xs text-ink-900/30 dark:border-white/[0.06] dark:text-white/25">
          Momentum v1.0
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
