import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface HomeSectionProps {
  title: string;
  /** Destino del enlace "Ver todo"; sin él, la sección no lo muestra. */
  to?: string;
  linkLabel?: string;
  children: ReactNode;
  className?: string;
}

/** Bloque del inicio del panel: título, enlace a la pantalla completa y contenido. */
export default function HomeSection({ title, to, linkLabel = 'Ver todo', children, className = '' }: HomeSectionProps) {
  return (
    <section aria-label={title} className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-primary">{title}</h2>
        {to && (
          <Link to={to as string} className="inline-flex items-center gap-1 text-sm font-semibold text-secondary-dark hover:underline">
            {linkLabel}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
