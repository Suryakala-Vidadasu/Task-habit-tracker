import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Flame, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  getErrorMessage,
  getPasswordStrength,
  passwordStrengthLabel,
  passwordStrengthColor,
} from "../utils/helpers";

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { name: "", email: "", password: "", confirmPassword: "" } });

  const password = watch("password", "");
  const strength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await registerUser(data);
      toast.success("Account created! Welcome to Momentum.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-aurora-light px-4 py-10 dark:bg-aurora-dark">
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
          Create your account
        </h1>
        <p className="mt-1 text-center text-sm text-ink-900/50 dark:text-white/40">
          Free forever. Set up in under a minute.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <Input
            label="Full name"
            icon={User}
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

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

          <div>
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
              })}
            />
            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors"
                      style={{
                        backgroundColor:
                          i < strength ? passwordStrengthColor(strength) : "rgba(148,163,184,0.25)",
                      }}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs font-medium" style={{ color: passwordStrengthColor(strength) }}>
                  {passwordStrengthLabel(strength)}
                </p>
              </div>
            )}
          </div>

          <Input
            label="Confirm password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
          />

          <Button type="submit" className="w-full" loading={submitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-900/50 dark:text-white/40">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
