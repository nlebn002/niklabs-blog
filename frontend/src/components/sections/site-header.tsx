import { Link } from "react-router-dom";
import { buttonStyles } from "../ui/button";
import { Panel } from "../ui/panel";

type SiteHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTo: string;
};

export function SiteHeader({ eyebrow, title, description, ctaLabel, ctaTo }: SiteHeaderProps) {
  return (
    <Panel className="relative overflow-hidden border-border/80 bg-card/95 p-0">
      <div className="grid gap-10 p-6 lg:grid-cols-[1.45fr_0.8fr] lg:p-10">
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">{eyebrow}</p>
          <div className="space-y-4">
            <h1 className="font-display max-w-4xl text-5xl leading-[0.95] tracking-[-0.04em] md:text-6xl lg:text-7xl">{title}</h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{description}</p>
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

        <div className="flex flex-col justify-between rounded-[1.75rem] border border-border/80 bg-secondary px-6 py-6 text-secondary-foreground shadow-soft">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-secondary-foreground/72">Editorial focus</p>
            <h2 className="font-display text-3xl leading-tight tracking-[-0.03em]">Precise thinking for modern engineering work.</h2>
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
      <div className="editorial-rule" />
      <div className="grid gap-4 px-6 py-5 text-sm text-muted-foreground lg:grid-cols-3 lg:px-10">
        <p>Readable on mobile, deliberate on desktop, and built to make long-form technical writing feel premium.</p>
        <p>One visual motif: precise editorial gridlines that frame the content without turning it into a dashboard.</p>
        <p className="font-semibold text-foreground">Built for article discovery and serious reading, not generic homepage theatrics.</p>
      </div>
    </Panel>
  );
}
