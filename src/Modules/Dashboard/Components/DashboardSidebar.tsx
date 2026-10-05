import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Compass, LogOut } from 'lucide-react';
import { DASHBOARD_AREAS, isNavItemActive, type DashboardArea } from '../config/navigation';
import { useDashboardUser } from '../hooks/useDashboardUser';
import AreaSwitcher from './AreaSwitcher';

interface DashboardSidebarProps {
  area: DashboardArea;
  /** Se llama al elegir una opción (en mobile cierra el drawer). */
  onNavigate?: () => void;
}

const footerLinkClass =
  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white';

/** Sidebar del panel: logo, usuario, opciones del área y salidas (volver al sitio, cerrar sesión). */
export default function DashboardSidebar({ area, onNavigate }: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { fullName, initials, logout } = useDashboardUser();
  const config = DASHBOARD_AREAS[area];

  async function handleLogout() {
    onNavigate?.();
    // Primero se sale del panel: si no, al perder la sesión el panel redirigiría a /login.
    await navigate({ to: '/' });
    logout();
  }

  return (
    <div className="flex h-full w-full flex-col bg-primary text-white">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2 px-5 py-5" aria-label="SafeRent, inicio">
        <img src="/LogoSafeRentAzul.png" alt="" className="size-9 rounded-lg bg-white object-contain p-0.5" />
        <span className="text-xl font-bold tracking-tight">SafeRent</span>
      </Link>

      <div className="mx-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-sm font-bold" aria-hidden="true">
          {initials || '?'}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{fullName ?? 'Mi cuenta'}</p>
          <p className="truncate text-xs text-white/60">{config.title}</p>
        </div>
      </div>

      <nav aria-label={config.title} className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
        {config.nav.map((item) => {
          const active = isNavItemActive(item, area, pathname);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              // El inicio del área (/dashboard) es prefijo de todas sus pantallas: solo cuenta como activo en su ruta exacta.
              activeOptions={{ exact: item.to === config.basePath }}
              className={`flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'border-secondary bg-white/10 text-white'
                  : 'border-transparent text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.Icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        <AreaSwitcher current={area} onNavigate={onNavigate} />
        <Link to="/explorar" onClick={onNavigate} className={footerLinkClass}>
          <Compass size={18} aria-hidden="true" />
          Volver a Explorar
        </Link>
        <button type="button" onClick={() => void handleLogout()} className={footerLinkClass}>
          <LogOut size={18} aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
