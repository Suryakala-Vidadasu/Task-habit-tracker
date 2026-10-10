import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Flame, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { authService } from "../services/authService";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { getErrorMessage } from "../utils/helpers";

const ForgotPassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "" } });

  const onSubmit = async ({ email }) => {
    setSubmitting(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
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

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <h1 className="font-display text-xl font-bold text-ink-900 dark:text-white">
              Check your inbox
            </h1>
            <p className="mt-2 text-sm text-ink-900/55 dark:text-white/45">
              If that email is registered, we've sent a link to reset your password.
            </p>
            <Link to="/login" className="btn-secondary mt-6 w-full">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-center font-display text-2xl font-bold text-ink-900 dark:text-white">
              Reset your password
            </h1>
            <p className="mt-1 text-center text-sm text-ink-900/50 dark:text-white/40">
              Enter your email and we'll send you a reset link.
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
              <Button type="submit" className="w-full" loading={submitting}>
                Send reset link
              </Button>
            </form>

            <Link
              to="/login"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-ink-900/50 hover:text-ink-900 dark:text-white/40 dark:hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
