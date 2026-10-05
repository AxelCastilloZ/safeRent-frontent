import { Link } from '@tanstack/react-router'
import { useAuth } from '../../Auth/hooks/authHooks'
import { DASHBOARD_AREAS, type DashboardArea } from '../config/navigation'

const AREAS = [
  { area: 'client', role: 'CLIENT', label: 'Inquilino' },
  { area: 'owner', role: 'OWNER', label: 'Propietario' },
  { area: 'admin', role: 'ADMIN', label: 'Administrador' },
] as const

export default function AreaSwitcher({ current, onNavigate }: { current: DashboardArea; onNavigate?: () => void }) {
  const { user } = useAuth()
  const areas = AREAS.filter(({ role }) => user?.roles.includes(role))
  if (!areas.length) return null
  return <div className="rounded-xl border border-white/20 p-3">
    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Mis paneles</p>
    <div className="mt-2 flex flex-wrap gap-1">
      {areas.map(({ area, label }) => <Link key={area} to={DASHBOARD_AREAS[area].basePath}
        onClick={onNavigate} aria-current={area === current ? 'page' : undefined}
        className={`flex-1 rounded-md px-2 py-1.5 text-center text-[11px] font-semibold transition ${area === current ? 'bg-white text-primary' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
        {label}
      </Link>)}
    </div>
  </div>
}
