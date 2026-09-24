import { NavLink } from 'react-router-dom'
import { Building2, CalendarDays, MessageSquare, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavItem = { to: string; label: string; Icon: LucideIcon }

const navItems: NavItem[] = [
  { to: '/propietario/propiedades', label: 'Propiedades', Icon: Building2 },
  { to: '/propietario/calendario', label: 'Calendario', Icon: CalendarDays },
  { to: '/propietario/mensajes', label: 'Mensajes', Icon: MessageSquare },
  { to: '/propietario/ajustes', label: 'Ajustes', Icon: Settings },
]

export default function OwnerSidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white max-md:w-full max-md:flex-row max-md:border-b max-md:border-r-0">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 max-md:hidden">
        <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          A
        </div>
        <span className="text-sm font-semibold text-primary">Arrendatario</span>
      </div>

      <nav className="flex flex-col gap-1 p-3 max-md:flex-row max-md:gap-0 max-md:p-1">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors max-md:flex-1 max-md:justify-center max-md:gap-1.5 max-md:rounded-lg max-md:px-2 max-md:py-2 max-md:text-xs ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
