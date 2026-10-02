import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Botones u otros controles alineados a la derecha. */
  actions?: ReactNode;
}

/** Título de una pantalla del panel, con descripción y acciones opcionales. */
export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-ink">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
