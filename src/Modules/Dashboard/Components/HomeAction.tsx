import { Link } from '@tanstack/react-router';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface HomeActionProps {
  to: string;
  icon: LucideIcon;
  children: ReactNode;
  /** La acción principal del panel va en verde; las demás, con borde. */
  primary?: boolean;
}

const styles = {
  primary: 'bg-secondary font-bold text-white hover:bg-secondary-dark',
  secondary: 'border border-slate-200 bg-white font-semibold text-primary hover:border-secondary',
};

/** Botón de acción rápida del encabezado del inicio. */
export default function HomeAction({ to, icon: Icon, children, primary = false }: HomeActionProps) {
  return (
    <Link to={to as string} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${primary ? styles.primary : styles.secondary}`}>
      <Icon size={16} aria-hidden="true" />
      {children}
    </Link>
  );
}
