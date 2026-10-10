import clsx from "clsx";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger: "btn-danger",
};

const Button = ({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  className,
  icon: Icon,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(VARIANTS[variant], className)}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      {children}
    </button>
  );
};

export default Button;
