import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, LogOut, UserCircle, ChevronDown } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { initials } from "../../utils/helpers";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-900/[0.06] bg-white/70 px-4 py-3.5 backdrop-blur-xl sm:px-6 dark:border-white/[0.06] dark:bg-ink-950/70">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-ink-900/60 hover:bg-ink-900/[0.05] lg:hidden dark:text-white/50 dark:hover:bg-white/[0.06]"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-ink-900/60 transition-colors hover:bg-ink-900/[0.05] dark:text-white/50 dark:hover:bg-white/[0.06]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2.5 transition-colors hover:bg-ink-900/[0.05] dark:hover:bg-white/[0.06]"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                {initials(user?.name || "U")}
              </div>
            )}
            <span className="hidden text-sm font-medium text-ink-900 sm:block dark:text-white">
              {user?.name?.split(" ")[0]}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-ink-900/40 sm:block dark:text-white/40" />
          </button>

          {menuOpen && (
            <div className="glass-panel absolute right-0 top-full mt-2 w-48 animate-fade-up p-1.5">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-900/70 hover:bg-ink-900/[0.05] dark:text-white/60 dark:hover:bg-white/[0.06]"
              >
                <UserCircle className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
