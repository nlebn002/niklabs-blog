import { Link } from "react-router-dom";
import { buttonStyles } from "../ui/button";

type SiteHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTo: string;
};

export function SiteHeader({ eyebrow, title, description, ctaLabel, ctaTo }: SiteHeaderProps) {
  return (
    <section className="relative overflow-hidden py-[72px]">
      <div className="grid gap-10 p-6 lg:grid-cols-[1.45fr_0.8fr] lg:p-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 animate-[fadeUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-[blink_2.5s_ease-in-out_infinite]" />
            <span className="text-[12px] tracking-[0.02em] text-primary">{eyebrow}</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-[clamp(36px,5vw,56px)] font-bold leading-[1.1] tracking-[-0.03em] animate-[fadeUp_0.6s_60ms_cubic-bezier(0.16,1,0.3,1)_both]">
              {title}
            </h1>
            <p className="max-w-[460px] text-[16px] leading-[1.65] text-muted-foreground animate-[fadeUp_0.6s_120ms_cubic-bezier(0.16,1,0.3,1)_both]">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link className={buttonStyles("primary", "px-6", "lg")} to={ctaTo}>
              {ctaLabel}
            </Link>
            <div className="text-sm text-muted-foreground">
              Technical writing for founders, developers, and hiring managers who want signal, not filler.
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-border/80 bg-secondary px-6 py-6 text-secondary-foreground shadow-soft">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-secondary-foreground/72">Editorial focus</p>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em]">Precise thinking for modern engineering work.</h2>
            <p className="text-sm leading-7 text-secondary-foreground/78">
              Essays, patterns, and interview-ready explanations shaped with product taste and founder-level clarity.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-secondary-foreground/15 pt-5 text-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-secondary-foreground/60">Format</p>
              <p className="mt-2 font-semibold">Deep technical essays</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-secondary-foreground/60">Standard</p>
              <p className="mt-2 font-semibold">Editorial, opinionated, useful</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
