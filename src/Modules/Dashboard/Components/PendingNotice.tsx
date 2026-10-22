import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';

interface PendingNoticeProps {
  /** Qué falta para que la pantalla muestre datos reales (endpoint, estado en el backend…). */
  children: string;
}

/** Aviso honesto en pantallas con interfaz lista pero sin backend: dice qué falta integrar. */
export default function PendingNotice({ children }: PendingNoticeProps) {
  const { t } = useTranslation();
  return (
    <p className="flex items-start gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-muted-ink">
      <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>
        <strong className="font-semibold text-primary">{t("common:pending")}</strong> {children}
      </span>
    </p>
  );
}
