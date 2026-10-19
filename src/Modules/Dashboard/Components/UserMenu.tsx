import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { roleHome } from '../../Auth/utils/roleHome';
import { DASHBOARD_AREAS, getAreaFromPath } from '../config/navigation';
import { useUnreadMessagesCount } from '../../Messages/hooks/messageHooks';
import UnreadBadge from '../../Messages/Components/UnreadBadge';
import { useDashboardUser } from '../hooks/useDashboardUser';


/**
 * Avatar del usuario con su menú (nombre, correo, "Ir a mi panel", accesos y cerrar sesión).
 * Se cierra al volver a pulsar el avatar, al hacer clic fuera, con Escape y al elegir una opción.
 */
export default function UserMenu({ onAction }: { onAction?: () => void }) {
  const { fullName, initials, email, logout, roles } = useDashboardUser();
  const { pathname } = useLocation();
  const home = roleHome(roles);
  const area = getAreaFromPath(home);
  const quickLinks = DASHBOARD_AREAS[area].nav.slice(1);
  const unreadMessages = useUnreadMessagesCount();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function close() {
    setOpen(false);
    onAction?.();
  }

  async function handleLogout() {
    close();
    // Dentro del panel se sale primero al inicio: si no, al perder la sesión el panel mandaría a /login.
    if (pathname.startsWith('/dashboard')) await navigate({ to: '/' });
    logout();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Menú de ${fullName ?? 'mi cuenta'}${unreadMessages > 0 ? `, ${unreadMessages} mensajes sin leer` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="user-menu-panel"
        className={`relative grid size-10 place-items-center rounded-full bg-primary text-sm font-semibold text-white transition hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          open ? 'ring-2 ring-secondary ring-offset-2' : ''
        }`}
      >
        {initials || '?'}
        {unreadMessages > 0 && (
          <span aria-hidden="true" className="absolute right-0 top-0 size-3 rounded-full border-2 border-white bg-secondary-dark" />
        )}
      </button>

      {open && (
        <div
          id="user-menu-panel"
          className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
        >
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-white" aria-hidden="true">
              {initials || '?'}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold text-primary">{fullName ?? 'Mi cuenta'}</p>
              {email && <p className="truncate text-xs text-muted-ink">{email}</p>}
            </div>
          </div>

          <Link
            to={home}
            onClick={close}
            className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard size={18} aria-hidden="true" />
              Ir a mi panel
            </span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>

          <ul className="mt-2 space-y-0.5">
            {quickLinks.map(({ to, label, Icon }) => (
              <li key={to}>
                <Link to={to} onClick={close} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-primary transition hover:bg-slate-100">
                  <Icon size={18} className="text-muted-ink" aria-hidden="true" />
                  {label}
                  {to === DASHBOARD_AREAS[area].messagesPath && <UnreadBadge count={unreadMessages} className="ml-auto" />}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
