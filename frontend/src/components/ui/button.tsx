import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "default" | "sm" | "lg" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90",
  ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
  danger: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline: "border border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
};

const buttonSizes: Record<ButtonSize, string> = {
  default: "h-11 px-5 py-2.5",
  sm: "h-9 rounded-md px-3",
  lg: "h-12 rounded-xl px-8",
  icon: "h-11 w-11"
};

export function buttonStyles(variant: ButtonVariant = "primary", className?: string, size: ButtonSize = "default") {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
    buttonVariants[variant],
    buttonSizes[size],
    className
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "default", ...props },
  ref
) {
  return <button ref={ref} className={buttonStyles(variant, className, size)} {...props} />;
});
