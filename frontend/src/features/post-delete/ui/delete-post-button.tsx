import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

type DeletePostButtonProps = {
  disabled?: boolean;
  label: string;
  onClick: () => void;
};

export function DeletePostButton({ disabled, label, onClick }: DeletePostButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} type="button" variant="danger">
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this post?</DialogTitle>
          <DialogDescription>
            This action removes the post permanently from your posts list. Use this only when you do not need the content
            anymore.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              onClick();
              setOpen(false);
            }}
          >
            Confirm delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
