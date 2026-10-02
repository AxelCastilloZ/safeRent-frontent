import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyPanelProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Estado vacío de una lista o tarjeta del panel. */
export default function EmptyPanel({ icon: Icon, title, description, action }: EmptyPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
      <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={28} aria-hidden="true" />
      </span>
      <h2 className="text-lg font-bold text-primary">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-sm text-muted-ink">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
