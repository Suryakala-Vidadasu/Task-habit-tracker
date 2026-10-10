import { Link } from "react-router-dom";
import { Home, Flame } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-aurora-light px-4 text-center dark:bg-aurora-dark">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient">
        <Flame className="h-8 w-8 text-white" />
      </div>
      <h1 className="font-display text-6xl font-bold text-ink-900 dark:text-white">404</h1>
      <p className="mt-3 text-ink-900/55 dark:text-white/45">
        This page took a rest day. Let's get you back on track.
      </p>
      <Link to="/" className="btn-primary mt-7">
        <Home className="h-4 w-4" /> Back to home
      </Link>
    </div>
  );
};

export default NotFound;
