import type { PropsWithChildren } from "react";
import { Cloud, FilePlus, KeyRound, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser, useLogout } from "@/features/auth/api/hooks";
import { ThemeToggle } from "@/features/theme/ui/theme-toggle";
import { routes } from "@/router";
import { cn } from "@/utils/cn";
import { buttonStyles } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

type SiteShellProps = PropsWithChildren<{
  contentClassName?: string;
}>;

export function SiteShell({ children, contentClassName }: SiteShellProps) {
  const currentUserQuery = useCurrentUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-site text-foreground">
      <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between gap-4 px-[clamp(1rem,4vw,2rem)]">
          <Link className="group inline-flex items-center gap-2" to={routes.home()}>
            <span className="grid h-7 w-7 place-items-center rounded bg-primary transition-[transform,box-shadow] duration-200 ease-[var(--ease-expo)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(79,114,255,0.4)]">
              <Cloud className="h-4 w-4 text-white" strokeWidth={2} />
            </span>
            <span className="text-[15px] font-semibold leading-none tracking-[-0.025em] text-foreground">
              niklabs<span className="font-normal text-[var(--text-tertiary)]">.cloud</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              className="relative hidden rounded px-3 py-1.5 text-[14px] text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground sm:inline-flex"
              to={routes.home()}
            >
              Articles
            </Link>

            {currentUserQuery.data ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" aria-label="Open account menu" className={buttonStyles("ghost", undefined, "icon")}>
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[16rem]">
                  <div className="px-2 py-2">
                    <p className="truncate text-sm font-semibold text-popover-foreground">
                      {currentUserQuery.data.userName || "Account"}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {currentUserQuery.data.email || "Signed in"}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={routes.postCreate()}>
                      <FilePlus />
                      <span>Create post</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={routes.changePassword()}>
                      <KeyRound />
                      <span>Change password</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await logoutMutation.mutateAsync();
                      navigate(routes.login());
                    }}
                  >
                    <LogOut />
                    <span>{logoutMutation.isPending ? "Signing out..." : "Sign out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                className="inline-flex h-8 items-center justify-center rounded border border-border bg-card px-3 text-[13px] font-medium text-muted-foreground transition-all hover:border-white/20 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:px-4"
                to={routes.login()}
              >
                Login
              </Link>
            )}

            <ThemeToggle />
          </div>
        </div>
      </header>

      <main
        className={cn(
          "mx-auto flex min-h-[calc(100vh-9rem)] w-full flex-col gap-10 px-[clamp(1rem,4vw,2rem)] py-8 lg:py-10",
          contentClassName
        )}
      >
        {children}
      </main>

      <footer className="relative z-10 border-t border-border bg-transparent">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-[clamp(1rem,4vw,2rem)] py-7 text-[13px] text-[var(--text-tertiary)]">
          <Link to={routes.home()} className="flex items-center gap-2 text-[13px] font-semibold tracking-[-0.02em] text-foreground">
            <span className="grid h-[22px] w-[22px] place-items-center rounded-sm bg-primary">
              <Cloud className="h-3.5 w-3.5 text-white" strokeWidth={2} />
            </span>
            niklabs<span className="font-normal text-[var(--text-tertiary)]">.cloud</span>
          </Link>
          <p>Built with passion for clean code and scalable systems.</p>
          <p>&copy; 2026 Niklabs</p>
        </div>
      </footer>
    </div>
  );
}
