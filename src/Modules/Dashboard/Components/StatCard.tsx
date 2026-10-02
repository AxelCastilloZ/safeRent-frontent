import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  /** Valor real. `undefined` = todavía no hay endpoint: se muestra "—" y la nota de pendiente. */
  value?: number | string;
  icon: LucideIcon;
  hint?: string;
  isLoading?: boolean;
}

/** Tarjeta de métrica. Nunca simula datos: sin valor muestra "—" y lo dice. */
export default function StatCard({ label, value, icon: Icon, hint, isLoading }: StatCardProps) {
  const isPending = value === undefined && !isLoading;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-ink">{label}</p>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-primary">
        {isLoading ? <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" aria-label="Cargando" /> : (value ?? '—')}
      </p>
      <p className="mt-1 text-xs text-muted-ink">{isPending ? 'Pendiente de integrar' : hint}</p>
    </article>
  );
}
