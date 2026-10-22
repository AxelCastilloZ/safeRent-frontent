import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import type { ReactNode } from 'react';

const COLUMNS = {
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 xl:grid-cols-4',
} as const;

interface StatGridProps {
  /** Cuántas `StatCard` lleva. En celular van de a dos; si sobra una, ocupa todo el ancho. */
  columns: keyof typeof COLUMNS;
  children: ReactNode;
}

/** Fila de cifras del inicio de cada panel. */
export default function StatGrid({ columns, children }: StatGridProps) {
  useTranslation();
  return (
    <section aria-label={i18n.t("dashboard:statgrid_resumen")} className={`grid grid-cols-2 gap-3 sm:gap-4 max-sm:[&>*:last-child:nth-child(odd)]:col-span-2 ${COLUMNS[columns]}`}>
      {children}
    </section>
  );
}
