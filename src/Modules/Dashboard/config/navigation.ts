import {
  Building2,
  CalendarCheck,
  ClipboardList,
  Flag,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * Las áreas se protegen con los roles CLIENT, OWNER y ADMIN de la cuenta.
 */
export type DashboardArea = 'client' | 'owner' | 'admin';

export interface DashboardNavItem {
  to: string;
  label: string;
  Icon: LucideIcon;
}

export interface DashboardAreaConfig {
  /** Título del panel en el sidebar y el header. */
  title: string;
  /** Ruta del inicio del área; también es el prefijo de todas sus pantallas. */
  basePath: string;
  /** Dónde vive Mensajes dentro del área (la bandeja y el chat se montan ahí). */
  messagesPath: string;
  nav: DashboardNavItem[];
}

// Tipada como string a propósito: el router solo valida rutas literales y estas se
// arman desde configuración.
export const DASHBOARD_HOME_PATH: string = '/dashboard';

export const DASHBOARD_AREAS: Record<DashboardArea, DashboardAreaConfig> = {
  client: {
    title: 'Panel del inquilino',
    basePath: '/dashboard',
    messagesPath: '/dashboard/messages',
    nav: [
      { to: '/dashboard', label: 'Inicio', Icon: LayoutDashboard },
      { to: '/dashboard/reservations', label: 'Mis reservaciones', Icon: CalendarCheck },
      { to: '/dashboard/messages', label: 'Mensajes', Icon: MessageSquare },
      { to: '/dashboard/saved', label: 'Propiedades guardadas', Icon: Heart },
      { to: '/dashboard/settings', label: 'Ajustes', Icon: Settings },
    ],
  },
  owner: {
    title: 'Panel del propietario',
    basePath: '/dashboard/owner',
    messagesPath: '/dashboard/owner/messages',
    nav: [
      { to: '/dashboard/owner', label: 'Inicio', Icon: LayoutDashboard },
      { to: '/dashboard/owner/properties', label: 'Mis propiedades', Icon: Building2 },
      { to: '/dashboard/owner/requests', label: 'Reservaciones / Solicitudes', Icon: ClipboardList },
      { to: '/dashboard/owner/messages', label: 'Mensajes', Icon: MessageSquare },
      { to: '/dashboard/owner/settings', label: 'Ajustes', Icon: Settings },
    ],
  },
  admin: {
    title: 'Panel administrativo',
    basePath: '/dashboard/admin',
    messagesPath: '/dashboard/admin/messages',
    nav: [
      { to: '/dashboard/admin', label: 'Resumen', Icon: LayoutDashboard },
      { to: '/dashboard/admin/properties', label: 'Propiedades', Icon: Building2 },
      { to: '/dashboard/admin/comments', label: 'Comentarios', Icon: MessageSquare },
      { to: '/dashboard/admin/users', label: 'Usuarios', Icon: Users },
      { to: '/dashboard/admin/reports', label: 'Reportes', Icon: Flag },
      { to: '/dashboard/admin/settings', label: 'Ajustes', Icon: Settings },
    ],
  },
};

/** Área a la que pertenece una ruta (`/dashboard/owner/...` → owner; cualquier otra → client). */
export function getAreaFromPath(pathname: string): DashboardArea {
  if (pathname === '/dashboard/owner' || pathname.startsWith('/dashboard/owner/')) return 'owner';
  if (pathname === '/dashboard/admin' || pathname.startsWith('/dashboard/admin/')) return 'admin';
  return 'client';
}

/** true si `pathname` está dentro de la opción `to` (el inicio solo coincide exacto). */
export function isNavItemActive(item: DashboardNavItem, area: DashboardArea, pathname: string): boolean {
  if (item.to === DASHBOARD_AREAS[area].basePath) return pathname === item.to;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}
