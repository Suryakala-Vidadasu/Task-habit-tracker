import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Flame, Mail, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { getErrorMessage } from "../utils/helpers";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "", rememberMe: true } });

  useEffect(() => {
    if (searchParams.get("expired")) {
      toast.error("Your session expired. Please log in again.");
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await login(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-aurora-light px-4 dark:bg-aurora-dark">
      <div className="glass-panel w-full max-w-md animate-fade-up p-8">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-gradient">
            <Flame className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-bold text-ink-900 dark:text-white">
            Momentum
          </span>
        </Link>

        <h1 className="text-center font-display text-2xl font-bold text-ink-900 dark:text-white">
          Welcome back
        </h1>
        <p className="mt-1 text-center text-sm text-ink-900/50 dark:text-white/40">
          Log in to keep your streak going.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <Input
            label="Email"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-ink-900/60 dark:text-white/50">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-ink-900/20 text-violet-500 focus:ring-violet-500"
                {...register("rememberMe")}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-violet-500 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" loading={submitting}>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-900/50 dark:text-white/40">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-violet-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
