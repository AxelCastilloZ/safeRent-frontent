import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { Link } from '@tanstack/react-router';

type LoadingShape = 'rows' | 'cards' | 'media';

const bar = 'animate-pulse rounded bg-slate-100';

/** Marcador de carga con la forma del contenido que va a aparecer (filas, tarjetas o foto + texto). */
export function SectionLoading({ shape = 'rows' }: { shape?: LoadingShape }) {
  useTranslation();
  return (
    <div role="status" aria-label={i18n.t("dashboard:sectionstates_cargando")}>
      {shape === 'rows' && (
        <div className="space-y-3">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-3">
              <div className={`${bar} size-8 shrink-0 rounded-full`} />
              <div className="flex-1 space-y-2">
                <div className={`${bar} h-3 w-2/5`} />
                <div className={`${bar} h-2.5 w-3/5`} />
              </div>
            </div>
          ))}
        </div>
      )}
      {shape === 'cards' && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((card) => (
            <div key={card} className="overflow-hidden rounded-xl border border-slate-100">
              <div className={`${bar} aspect-[16/10] rounded-none`} />
              <div className="space-y-2 p-3">
                <div className={`${bar} h-3 w-3/4`} />
                <div className={`${bar} h-2.5 w-1/2`} />
              </div>
            </div>
          ))}
        </div>
      )}
      {shape === 'media' && (
        <div className="flex gap-4">
          <div className={`${bar} size-24 shrink-0 rounded-xl sm:size-28`} />
          <div className="flex-1 space-y-2">
            <div className={`${bar} h-3.5 w-3/5`} />
            <div className={`${bar} h-2.5 w-4/5`} />
            <div className={`${bar} h-3 w-2/5`} />
          </div>
        </div>
      )}
    </div>
  );
}

export function SectionError({ message, onRetry }: { message: string; onRetry: () => void }) {
  useTranslation();
  return (
    <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
      {message}
      <button type="button" onClick={onRetry} className="ml-2 font-semibold underline">{i18n.t("comments:propertycomments_reintentar")}</button>
    </div>
  );
}

interface SectionEmptyProps {
  title: string;
  description: string;
  /** Texto y destino de la acción sugerida. */
  actionLabel?: string;
  actionTo?: string;
}

/** Estado vacío de un bloque: dice qué falta y qué puede hacer la persona. */
export function SectionEmpty({ title, description, actionLabel, actionTo }: SectionEmptyProps) {
  useTranslation();
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center">
      <p className="text-sm font-bold text-primary">{title}</p>
      <p className="mx-auto mt-1 max-w-xs text-xs text-muted-ink">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo as string} className="mt-3 inline-block rounded-lg bg-secondary px-4 py-2 text-xs font-bold text-white transition hover:bg-secondary-dark">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
