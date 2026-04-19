import { useEffect, useState, type PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/api/hooks";
import { cn } from "@/utils/cn";

type ThemeMode = "light" | "dark";

type SiteShellProps = PropsWithChildren<{
  contentClassName?: string;
}>;

const storageKey = "niklabs-theme";

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.setAttribute("data-theme", mode === "dark" ? "dark" : "amber");
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

export function SiteShell({ children, contentClassName }: SiteShellProps) {
  const currentUserQuery = useCurrentUser();
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.localStorage.getItem(storageKey) === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(storageKey, theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-site text-foreground">
      <header className="border-b border-border/60 bg-background/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-10">
          <Link className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.32em]" to="/">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm">
              <span className="text-base text-primary">N</span>
            </span>
            <span>NIKLABS</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              className={cn(
                "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                currentUserQuery.data ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              to={currentUserQuery.data ? "/admin/posts" : "/admin/login"}
            >
              {currentUserQuery.data ? "Admin" : "Login"}
            </Link>

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

      <main className={cn("mx-auto flex min-h-[calc(100vh-9rem)] w-full flex-col gap-8 px-6 py-8 lg:px-10", contentClassName)}>
        {children}
      </main>

      <footer className="border-t border-border/60 bg-background/65">
        <div className="mx-auto max-w-6xl px-6 py-5 text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground lg:px-10">
          NIKLABS {"\u00A9"} 2026
        </div>
      </footer>
    </div>
  );
}
