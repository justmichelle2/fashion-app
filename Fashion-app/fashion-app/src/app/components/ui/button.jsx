import { forwardRef } from "react";
import PropTypes from "prop-types";

const variantClasses = {
  default:
    "bg-[#E76F51] text-white hover:bg-[#D55B3A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F4A261]",
  outline:
    "border border-[#2D2D2D] text-[#2D2D2D] bg-transparent hover:bg-[#2D2D2D]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D2D2D]",
  ghost:
    "text-[#6B6B6B] bg-transparent hover:text-[#2D2D2D] focus-visible:underline",
};

const sizeClasses = {
  default: "h-12 px-6",
  lg: "h-14 px-8 text-lg",
  sm: "h-10 px-4 text-sm",
};

const mergeClasses = (...classes) => classes.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

const Button = forwardRef(function Button(
  { className = "", variant = "default", size = "default", ...props },
  ref
) {
  const variantClass = variantClasses[variant] || variantClasses.default;
  const sizeClass = sizeClasses[size] || sizeClasses.default;
  const composedClassName = mergeClasses(
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
    variantClass,
    sizeClass,
    className
  );

  return <button ref={ref} className={composedClassName} {...props} />;
});

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(Object.keys(variantClasses)),
  size: PropTypes.oneOf(Object.keys(sizeClasses)),
};

export { Button };
