interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  className = "",
  isLoading = false,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const baseClasses =
    "btn relative group overflow-hidden rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-500 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none shadow-md",
    secondary:
      "bg-gray-600 text-white hover:bg-gray-500 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-100 active:scale-95 disabled:border-gray-400 disabled:text-gray-400 shadow-none",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  return (
    <button
      className={combinedClasses}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="spinner-primary h-5 w-5" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}
