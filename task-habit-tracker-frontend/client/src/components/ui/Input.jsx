import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(
  ({ label, error, className, type = "text", icon: Icon, ...rest }, ref) => {
    return (
      <div className={className}>
        {label && <label className="label-text">{label}</label>}
        <div className="relative">
          {Icon && (
            <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/40 dark:text-white/30" />
          )}
          <input
            ref={ref}
            type={type}
            className={clsx("input-field", Icon && "pl-10", error && "!border-red-400")}
            {...rest}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
