import { Link } from "react-router-dom";
import { buttonStyles } from "../../shared/ui/button";
import { Panel } from "../../shared/ui/panel";

type SiteHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTo: string;
};

export function SiteHeader({ eyebrow, title, description, ctaLabel, ctaTo }: SiteHeaderProps) {
  return (
    <Panel className="grid gap-6 lg:grid-cols-[1.5fr_0.85fr]">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-clay">{eyebrow}</p>
        <h1 className="max-w-3xl text-5xl font-black leading-tight">{title}</h1>
        <p className="max-w-2xl text-lg text-slate-600">{description}</p>
      </div>

      <div className="rounded-[1.5rem] bg-ink px-6 py-6 text-slate-100">
        <p className="text-sm uppercase tracking-[0.24em] text-amber-300">Frontend structure</p>
        <h2 className="mt-3 text-2xl font-bold">Separated pages, features, and contracts.</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Public pages stay clean. Admin tools stay isolated. API types come from the backend contract.
        </p>
        <Link className={buttonStyles("primary", "mt-5 bg-clay text-white hover:bg-amber-700")} to={ctaTo}>
          {ctaLabel}
        </Link>
      </div>
    </Panel>
  );
}
