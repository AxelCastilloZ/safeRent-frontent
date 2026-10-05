import { Outlet, useLocation, useRouter } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MessagesBasePathContext } from '../../Messages/hooks/useMessagesBasePath';
import { DASHBOARD_AREAS, getAreaFromPath } from '../config/navigation';
import { useDashboardUser } from '../hooks/useDashboardUser';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

/**
 * Marco del panel privado: sidebar (fijo en escritorio, drawer en mobile) + header + contenido.
 * Sin sesión manda a /login (ver beforeLoad en DashboardRoutes) y, tras iniciar sesión, vuelve a donde quería entrar.
 * El área (cliente, propietario, admin) sale de la URL.
 */
export default function DashboardLayout() {
  const { hasSession } = useDashboardUser();
  const { pathname } = useLocation();
  const router = useRouter();
  // El drawer recuerda en qué ruta se abrió: al navegar deja de contar como abierto, sin efectos.
  const [drawer, setDrawer] = useState<{ open: boolean; path: string }>({ open: false, path: pathname });
  const drawerOpen = drawer.open && drawer.path === pathname;
  const area = getAreaFromPath(pathname);
  const config = DASHBOARD_AREAS[area];

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawer({ open: false, path: pathname });
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen, pathname]);

  // La sesión puede perderse con el panel abierto (token vencido): se manda a /login una sola vez.
  // No se usa <Navigate> en el render: con un `search` nuevo en cada render reinicia la navegación sin fin.
  useEffect(() => {
    if (!hasSession) void router.navigate({ to: '/login', search: { next: router.state.location.href }, replace: true });
  }, [hasSession, router]);

  if (!hasSession) return null;

  const closeDrawer = () => setDrawer({ open: false, path: pathname });

  return (
    <MessagesBasePathContext.Provider value={config.messagesPath}>
      <div className="flex h-screen bg-surface text-primary">
        <aside className="hidden w-64 shrink-0 md:block">
          <DashboardSidebar area={area} />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button type="button" aria-label="Cerrar menú del panel" onClick={closeDrawer} className="absolute inset-0 bg-slate-900/50" />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">
              <DashboardSidebar area={area} onNavigate={closeDrawer} />
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Cerrar menú del panel"
                className="absolute right-3 top-4 rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader title={config.title} onMenuClick={() => setDrawer({ open: true, path: pathname })} />
          {/* flex-col: Mensajes necesita ocupar toda la altura; el resto de pantallas se apilan y hacen scroll. */}
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </MessagesBasePathContext.Provider>
  );
}
