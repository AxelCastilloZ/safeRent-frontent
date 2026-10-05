import { Link, useMatchRoute } from '@tanstack/react-router'
import { Building2, CalendarDays, MessageSquare, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../../Auth/hooks/authHooks'

type SidebarRole = 'OWNER' | 'CLIENT'
type NavItem = { to: string; label: string; Icon: LucideIcon; roles: SidebarRole[] }

// Qué opciones ve cada rol. Para sumar una opción al inquilino basta con agregar 'CLIENT' a sus roles.
const navItems: NavItem[] = [
  { to: '/properties', label: 'Propiedades', Icon: Building2, roles: ['OWNER'] },
  { to: '/messages', label: 'Mensajes', Icon: MessageSquare, roles: ['OWNER', 'CLIENT'] },
  { to: '/calendario', label: 'Calendario', Icon: CalendarDays, roles: ['OWNER'] },
  { to: '/ajustes', label: 'Ajustes', Icon: Settings, roles: ['OWNER'] },
]

const roleLabels: Record<SidebarRole, string> = {
  OWNER: 'Arrendatario',
  CLIENT: 'Inquilino',
}

interface OwnerSidebarProps {
  /** Fuerza el menú de un rol (el panel de propiedades siempre es de arrendatario). Si se omite, se usa el rol de la sesión. */
  role?: SidebarRole
}

export default function OwnerSidebar({ role }: OwnerSidebarProps) {
  const matchRoute = useMatchRoute()
  const { user } = useAuth()
  const activeRole: SidebarRole = role ?? (user?.roles.includes('OWNER') ? 'OWNER' : 'CLIENT')
  const label = roleLabels[activeRole]

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white max-md:w-full max-md:flex-row max-md:border-b max-md:border-r-0">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 max-md:hidden">
        <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {label.charAt(0)}
        </div>
        <span className="text-sm font-semibold text-primary">{label}</span>
      </div>

      <nav className="flex flex-col gap-1 p-3 max-md:flex-row max-md:gap-0 max-md:p-1">
        {navItems
          .filter((item) => item.roles.includes(activeRole))
          .map(({ to, label: itemLabel, Icon }) => {
            const isActive = !!matchRoute({ to, fuzzy: true })
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors max-md:flex-1 max-md:justify-center max-md:gap-1.5 max-md:rounded-lg max-md:px-2 max-md:py-2 max-md:text-xs ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                }`}
              >
                <Icon size={18} />
                {itemLabel}
              </Link>
            )
          })}
      </nav>
    </aside>
  )
}
