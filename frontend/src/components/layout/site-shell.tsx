import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Cloud, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser, useLogout } from "@/features/auth/api/hooks";
import { ThemeToggle } from "@/features/theme/ui/theme-toggle";
import { routes } from "@/router";
import { cn } from "@/utils/cn";
import { buttonStyles } from "../ui/button";

type SiteShellProps = PropsWithChildren<{
  contentClassName?: string;
}>;

export function SiteShell({ children, contentClassName }: SiteShellProps) {
  const currentUserQuery = useCurrentUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountMenuOpen]);

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
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                  className={buttonStyles("ghost", undefined, "icon")}
                  onClick={() => setIsAccountMenuOpen((current) => !current)}
                >
                  <User className="h-4 w-4" />
                </button>

                {isAccountMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 min-w-[16rem] rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-card">
                    <div className="rounded-sm px-3 py-3">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {currentUserQuery.data.userName || "Account"}
                      </p>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {currentUserQuery.data.email || "Signed in"}
                      </p>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <Link
                      className="flex rounded-sm px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      to={routes.myPosts()}
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      My posts
                    </Link>
                    <Link
                      className="flex rounded-sm px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      to={routes.postCreate()}
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Create post
                    </Link>
                    <Link
                      className="flex rounded-sm px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      to={routes.changePassword()}
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Change password
                    </Link>
                    <button
                      type="button"
                      className="flex w-full rounded-sm px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      onClick={async () => {
                        await logoutMutation.mutateAsync();
                        setIsAccountMenuOpen(false);
                        navigate(routes.login());
                      }}
                    >
                      {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                ) : null}
              </div>
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
