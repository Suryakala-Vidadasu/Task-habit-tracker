import clsx from "clsx";

const Card = ({ children, className, hover = false, ...rest }) => {
  return (
    <div
      className={clsx(
        "glass-panel p-5",
        hover && "transition-transform duration-200 hover:-translate-y-0.5",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
