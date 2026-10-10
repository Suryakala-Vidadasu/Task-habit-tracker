import { format, isToday, isPast, isThisWeek } from "date-fns";

export const formatDate = (date) => {
  if (!date) return "";
  return format(new Date(date), "MMM d, yyyy");
};

export const formatFriendlyDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isToday(d)) return "Today";
  return format(d, "MMM d");
};

export const isOverdue = (dueDate, completed) => {
  if (!dueDate || completed) return false;
  return isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
};

export const isDueThisWeek = (dueDate) => {
  if (!dueDate) return false;
  return isThisWeek(new Date(dueDate));
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const getPasswordStrength = (password = "") => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export const passwordStrengthLabel = (score) =>
  ["Very weak", "Weak", "Fair", "Good", "Strong"][score] || "Very weak";

export const passwordStrengthColor = (score) =>
  ["#EF4444", "#F97316", "#FBBF24", "#34D399", "#22D3C4"][score] || "#EF4444";

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.errors?.[0]?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

export const initials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
