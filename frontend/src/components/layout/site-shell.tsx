import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogout } from "@/features/auth/api/hooks";
import { routes } from "@/router";
import { cn } from "@/utils/cn";

type ThemeMode = "light" | "dark";

type SiteShellProps = PropsWithChildren<{
  contentClassName?: string;
}>;

const storageKey = "niklabs-theme";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.setAttribute("data-theme", mode === "dark" ? "dark" : "default");
}

function SunIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23 5.46 5.46" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 9 9 0 1 0 20 15.2Z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
      <path d="M4.75 19.25a7.25 7.25 0 0 1 14.5 0" />
    </svg>
  );
}

export function SiteShell({ children, contentClassName }: SiteShellProps) {
  const currentUserQuery = useCurrentUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.localStorage.getItem(storageKey) === "dark" ? "dark" : "light";
  });
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

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
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/92 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between gap-4 px-5 py-4 lg:px-10">
          <Link className="inline-flex items-center gap-3" to={routes.home()}>
            <span className="font-display text-2xl text-primary">N</span>
            <span className="text-base font-extrabold tracking-[-0.02em]">Niklabs</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              className="hidden text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              to={routes.home()}
            >
              Blog
            </Link>

            {currentUserQuery.data ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  aria-expanded={isAccountMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                  onClick={() => setIsAccountMenuOpen((current) => !current)}
                >
                  <PersonIcon />
                </button>

                {isAccountMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-30 min-w-[16rem] rounded-[1rem] border border-border bg-[hsl(var(--card))] p-2 shadow-card">
                    <div className="rounded-[0.8rem] px-3 py-3">
                      <p className="text-sm font-semibold text-foreground">{currentUserQuery.data.userName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{currentUserQuery.data.email ?? "No email available"}</p>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <Link
                      className="flex rounded-[0.8rem] px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      to={routes.myPosts()}
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      My posts
                    </Link>
                    <Link
                      className="flex rounded-[0.8rem] px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      to={routes.postCreate()}
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Create post
                    </Link>
                    <Link
                      className="flex rounded-[0.8rem] px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      to={routes.changePassword()}
                      onClick={() => setIsAccountMenuOpen(false)}
                    >
                      Change password
                    </Link>
                    <button
                      type="button"
                      className="flex w-full rounded-[0.8rem] px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
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
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background sm:px-5"
                to={routes.login()}
              >
                Login
              </Link>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </Button>
          </div>
        </div>
      </header>

      <main
        className={cn(
          "mx-auto flex min-h-[calc(100vh-9rem)] w-full flex-col gap-10 px-5 py-8 lg:px-10 lg:py-10",
          contentClassName
        )}
      >
        {children}
      </main>

      <footer className="border-t border-border/70 bg-background">
        <div className="flex w-full flex-col gap-2 px-5 py-8 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <p>© 2026 Niklabs</p>
        </div>
      </footer>
    </div>
  );
}
