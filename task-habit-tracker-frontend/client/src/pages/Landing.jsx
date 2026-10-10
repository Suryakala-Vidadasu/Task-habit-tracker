import { Link } from "react-router-dom";
import {
  Flame,
  ListChecks,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Github,
  Twitter,
} from "lucide-react";
import StreakRing from "../components/ui/StreakRing";

const FEATURES = [
  {
    icon: ListChecks,
    title: "Tasks that don't slip",
    description:
      "Priorities, due dates, and search built in — so nothing important gets buried under the urgent.",
  },
  {
    icon: Flame,
    title: "Habits that compound",
    description:
      "Daily, weekly, or monthly — check in once and watch your streak ring fill. Miss a day and it tells you honestly.",
  },
  {
    icon: BarChart3,
    title: "Progress you can see",
    description:
      "Weekly bars, monthly trends, and a full completion heatmap turn your effort into a picture.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-aurora-light dark:bg-aurora-dark">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient">
            <Flame className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-bold text-ink-900 dark:text-white">
            Momentum
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost">
            Log in
          </Link>
          <Link to="/register" className="btn-primary">
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-600 dark:text-violet-300">
            Built for people who keep score
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] text-ink-900 sm:text-5xl dark:text-white">
            Plan the work.
            <br />
            Keep the <span className="bg-brand-gradient bg-clip-text text-transparent">streak</span> alive.
          </h1>
          <p className="mt-5 max-w-md text-base text-ink-900/60 dark:text-white/50">
            Momentum pairs a fast task manager with a habit tracker that actually shows your
            consistency — not just a checklist, a ring that fills as you show up.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/register" className="btn-primary">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="btn-secondary">
              I have an account
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-ink-900/40 dark:text-white/35">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Free forever plan
            </span>
          </div>
        </div>

        <div className="glass-panel animate-pop-in p-6 [animation-delay:150ms]">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-display text-sm font-semibold text-ink-900 dark:text-white">
              Today
            </p>
            <span className="text-xs text-ink-900/40 dark:text-white/35">Wed, Aug 26</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Morning run", streak: 12, color: "#FB7A3B" },
              { label: "Read 20 min", streak: 27, color: "#7C5CFC" },
              { label: "Deep work", streak: 5, color: "#3FE3D6" },
            ].map((h) => (
              <div key={h.label} className="flex flex-col items-center gap-2 rounded-xl bg-ink-900/[0.03] p-3 dark:bg-white/[0.04]">
                <StreakRing value={h.streak} max={30} size={44} />
                <span className="text-center text-[11px] font-medium text-ink-900/60 dark:text-white/50">
                  {h.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            {[
              { title: "Ship landing page", done: true },
              { title: "Review PR #142", done: true },
              { title: "Write weekly recap", done: false },
            ].map((t) => (
              <div key={t.title} className="flex items-center gap-3 rounded-lg px-2 py-1.5">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-[5px] border-2 ${
                    t.done ? "border-violet-500 bg-brand-gradient" : "border-ink-900/20 dark:border-white/20"
                  }`}
                >
                  {t.done && (
                    <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none stroke-white stroke-[3]">
                      <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm ${
                    t.done
                      ? "text-ink-900/35 line-through dark:text-white/30"
                      : "text-ink-900/80 dark:text-white/70"
                  }`}
                >
                  {t.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 max-w-lg">
          <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
            Everything you need, nothing you don't
          </h2>
          <p className="mt-3 text-ink-900/55 dark:text-white/45">
            Three tools that usually live in three different apps, working from one board.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="glass-panel p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient/10">
                <Icon className="h-5 w-5 text-violet-500" />
              </div>
              <h3 className="font-display text-base font-semibold text-ink-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-900/55 dark:text-white/45">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="glass-panel flex flex-col items-center gap-5 p-10 text-center sm:p-16">
          <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
            Your streak starts today
          </h2>
          <p className="max-w-md text-ink-900/55 dark:text-white/45">
            Set up your first habit in under a minute. It's free, and it stays free.
          </p>
          <Link to="/register" className="btn-primary">
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-ink-900/[0.06] px-6 py-8 text-sm text-ink-900/45 sm:flex-row dark:border-white/[0.06] dark:text-white/35">
        <span>© {new Date().getFullYear()} Momentum. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" aria-label="GitHub" className="hover:text-ink-900 dark:hover:text-white">
            <Github className="h-4 w-4" />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-ink-900 dark:hover:text-white">
            <Twitter className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
