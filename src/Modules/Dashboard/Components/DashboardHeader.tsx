import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import DisplayPreferences from '../../Auth/components/DisplayPreferences';
import UserMenu from './UserMenu';

interface DashboardHeaderProps {
  title: string;
  /** Abre el drawer del sidebar (solo se muestra en pantallas chicas). */
  onMenuClick: () => void;
}

/** Barra superior del panel: botón del menú en mobile, título del área y el menú del avatar. */
export default function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  const { t } = useTranslation();
  return (
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label={t("navigation:openPanel")}
          className="rounded-lg p-2 text-primary hover:bg-slate-100 md:hidden"
        >
          <Menu size={22} />
        </button>
        <p className="hidden truncate text-sm lg:block font-semibold text-primary">{t(title)}</p>
      </div>
      <div className="flex items-center gap-2"><DisplayPreferences /><UserMenu /></div>
    </header>
  );
}
