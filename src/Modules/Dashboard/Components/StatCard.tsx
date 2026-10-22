import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  /** Si se indica, toda la tarjeta lleva a esa sección del panel. */
  to?: string;
  label: string;
  /** Valor real. `undefined` = todavía no hay endpoint: se muestra "—" y la nota de pendiente. */
  value?: number | string;
  icon: LucideIcon;
  hint?: string;
  isLoading?: boolean;
}

/** Tarjeta de métrica. Nunca simula datos: sin valor muestra "—" y lo dice. */
export default function StatCard({ to, label, value, icon: Icon, hint, isLoading }: StatCardProps) {
  useTranslation();
  const isPending = value === undefined && !isLoading;

  const card = (
    <article className={`h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${to ? 'transition group-hover:border-secondary group-hover:shadow-md' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-ink sm:text-xs">{label}</p>
        <span className="grid size-8 shrink-0 place-items-center sm:size-9 rounded-full bg-primary/10 text-primary">
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 text-2xl font-extrabold text-primary sm:mt-3 sm:text-3xl">
        {isLoading ? <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" aria-label={i18n.t("dashboard:sectionstates_cargando")} /> : (value ?? '—')}
      </p>
      <p className="mt-1 text-xs text-muted-ink">{isPending ? i18n.t("dashboard:statcard_pendiente_de_integrar") : hint}</p>
    </article>
  );

  if (!to) return card;
  return (
    <Link to={to as string} className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
      {card}
    </Link>
  );
}
