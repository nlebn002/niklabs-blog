import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded font-medium tracking-[-0.01em] transition-colors duration-150 ease-[var(--ease-expo)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#7090ff] border border-transparent shadow-sm",
        destructive: "bg-destructive text-destructive-foreground border border-transparent hover:bg-destructive/90 shadow-sm",
        outline: "border border-input bg-card shadow-sm hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-foreground border border-white/15 hover:border-white/20 hover:bg-muted",
        ghost: "bg-transparent text-muted-foreground border border-border hover:border-foreground/20 hover:text-foreground hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 text-[13px]",
        sm: "h-8 px-3 text-[12.5px]",
        lg: "h-11 px-5 text-[14px]",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;
type LegacyButtonVariant = ButtonVariant | "primary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: LegacyButtonVariant;
  size?: ButtonSize;
};

function normalizeVariant(variant: LegacyButtonVariant = "default"): ButtonVariant {
  if (variant === "primary") {
    return "default";
  }

  if (variant === "danger") {
    return "destructive";
  }

  return variant;
}

function buttonStyles(variant: LegacyButtonVariant = "default", className?: string, size: ButtonSize = "default") {
  return cn(buttonVariants({ variant: normalizeVariant(variant), size }), className);
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "default", asChild = false, ...props },
  ref
) {
  const Comp = asChild ? Slot : "button";

  return <Comp ref={ref} className={buttonStyles(variant, className, size)} {...props} />;
});

export { Button, buttonStyles, buttonVariants };
export type { ButtonProps };
