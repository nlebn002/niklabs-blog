import { Dialog } from "radix-ui";
import type { ComponentPropsWithoutRef, ElementRef, HTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const DialogRoot = Dialog.Root;
const DialogTrigger = Dialog.Trigger;
const DialogPortal = Dialog.Portal;
const DialogClose = Dialog.Close;

const DialogOverlay = forwardRef<
  ElementRef<typeof Dialog.Overlay>,
  ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <Dialog.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-foreground/35 opacity-0 backdrop-blur-sm transition-opacity duration-200 data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
        className
      )}
      {...props}
    />
  );
});

const DialogContent = forwardRef<
  ElementRef<typeof Dialog.Content>,
  ComponentPropsWithoutRef<typeof Dialog.Content>
>(function DialogContent({ className, children, ...props }, ref) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-[1.75rem] border border-border bg-popover p-6 text-popover-foreground opacity-0 shadow-card transition duration-200 data-[state=open]:scale-100 data-[state=open]:opacity-100 data-[state=closed]:scale-95 data-[state=closed]:opacity-0",
          className
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </DialogPortal>
  );
});

function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-2 text-left", className)} {...props} />;
}

function DialogFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", className)} {...props} />;
}

const DialogTitle = forwardRef<
  ElementRef<typeof Dialog.Title>,
  ComponentPropsWithoutRef<typeof Dialog.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return <Dialog.Title ref={ref} className={cn("text-xl font-bold tracking-tight", className)} {...props} />;
});

const DialogDescription = forwardRef<
  ElementRef<typeof Dialog.Description>,
  ComponentPropsWithoutRef<typeof Dialog.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return <Dialog.Description ref={ref} className={cn("text-sm leading-6 text-muted-foreground", className)} {...props} />;
});

export {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
};
