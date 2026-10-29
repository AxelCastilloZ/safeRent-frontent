import {
  Building2,
  CalendarCheck,
  CalendarClock,
  Heart,
  LayoutDashboard,
  Mail,
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
    title: 'navigation:clientPanel',
    basePath: '/dashboard',
    messagesPath: '/dashboard/messages',
    nav: [
      { to: '/dashboard', label: 'navigation:home', Icon: LayoutDashboard },
      { to: '/dashboard/visits', label: 'navigation:myVisits', Icon: CalendarClock },
      { to: '/dashboard/reservations', label: 'navigation:reservations', Icon: CalendarCheck },
      { to: '/dashboard/messages', label: 'navigation:messages', Icon: MessageSquare },
      { to: '/dashboard/saved', label: 'navigation:saved', Icon: Heart },
      { to: '/dashboard/owner/properties', label: 'navigation:publications', Icon: Building2 },
      { to: '/dashboard/settings', label: 'navigation:settings', Icon: Settings },
    ],
  },
  owner: {
    title: 'navigation:ownerPanel',
    basePath: '/dashboard/owner',
    messagesPath: '/dashboard/owner/messages',
    nav: [
      { to: '/dashboard/owner', label: 'navigation:home', Icon: LayoutDashboard },
      { to: '/dashboard/owner/properties', label: 'navigation:properties', Icon: Building2 },
      { to: '/dashboard/owner/visits', label: 'navigation:visits', Icon: CalendarClock },
      { to: '/dashboard/owner/messages', label: 'navigation:messages', Icon: MessageSquare },
      { to: '/dashboard/owner/settings', label: 'navigation:settings', Icon: Settings },
    ],
  },
  admin: {
    title: 'navigation:adminPanel',
    basePath: '/dashboard/admin',
    messagesPath: '/dashboard/admin/messages',
    nav: [
      { to: '/dashboard/admin', label: 'navigation:summary', Icon: LayoutDashboard },
      { to: '/dashboard/admin/properties', label: 'navigation:allProperties', Icon: Building2 },
      { to: '/dashboard/admin/comments', label: 'navigation:comments', Icon: MessageSquare },
      { to: '/dashboard/admin/services', label: 'dashboard:adminhomepage_servicios', Icon: Building2 },
      { to: '/dashboard/admin/users', label: 'navigation:users', Icon: Users },
      // Icono distinto de "Comentarios" (MessageSquare) para no confundirlos.
      { to: '/dashboard/admin/messages', label: 'navigation:messages', Icon: Mail },
      // { to: '/dashboard/admin/reports', label: 'navigation:reports', Icon: Flag },
      { to: '/dashboard/admin/settings', label: 'navigation:settings', Icon: Settings },
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
