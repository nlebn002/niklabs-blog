import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../lib/cn";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
  }
>;

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-ink text-white hover:bg-slate-800",
  secondary: "bg-pine text-white hover:bg-teal-700",
  ghost: "border border-fog bg-white text-ink hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

export function buttonStyles(variant: NonNullable<ButtonProps["variant"]> = "primary", className?: string) {
  return cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
    buttonVariants[variant],
    className
  );
}

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={buttonStyles(variant, className)} {...props}>
      {children}
    </button>
  );
}
