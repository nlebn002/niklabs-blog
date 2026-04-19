import { Button } from "../../../components/ui/button";

type DeletePostButtonProps = {
  disabled?: boolean;
  label: string;
  onClick: () => void;
};

export function DeletePostButton({ disabled, label, onClick }: DeletePostButtonProps) {
  return (
    <Button disabled={disabled} type="button" variant="danger" onClick={onClick}>
      {label}
    </Button>
  );
}
