import { Menu } from 'lucide-react';
import UserMenu from './UserMenu';

interface DashboardHeaderProps {
  title: string;
  /** Abre el drawer del sidebar (solo se muestra en pantallas chicas). */
  onMenuClick: () => void;
}

/** Barra superior del panel: botón del menú en mobile, título del área y el menú del avatar. */
export default function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menú del panel"
          className="rounded-lg p-2 text-primary hover:bg-slate-100 md:hidden"
        >
          <Menu size={22} />
        </button>
        <p className="truncate text-sm font-semibold text-primary">{title}</p>
      </div>
      <UserMenu />
    </header>
  );
}
