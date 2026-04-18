import { useNavigate } from "react-router-dom";
import { buttonStyles } from "../../../shared/ui/button";
import { useLogout } from "../api/hooks";

export function LogoutButton() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  return (
    <button
      className={buttonStyles("ghost")}
      onClick={async () => {
        await logoutMutation.mutateAsync();
        navigate("/admin/login");
      }}
      type="button"
    >
      {logoutMutation.isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
