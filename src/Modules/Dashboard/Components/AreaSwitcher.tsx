import { Link } from '@tanstack/react-router';
import { DASHBOARD_AREAS, type DashboardArea } from '../config/navigation';

const AREAS: { area: DashboardArea; label: string }[] = [
  { area: 'client', label: 'Inquilino' },
  { area: 'owner', label: 'Propietario' },
  { area: 'admin', label: 'Admin' },
];

/**
 * TEMPORAL: mientras los roles no estén integrados, cualquiera con sesión puede ver las
 * tres áreas del panel. Este selector permite revisarlas; se elimina al integrar roles
 * (cada usuario entrará solo al área de su rol).
 */
export default function AreaSwitcher({ current, onNavigate }: { current: DashboardArea; onNavigate?: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-white/20 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">Vista de prueba (temporal)</p>
      <div className="mt-2 grid grid-cols-3 gap-1">
        {AREAS.map(({ area, label }) => (
          <Link
            key={area}
            to={DASHBOARD_AREAS[area].basePath}
            onClick={onNavigate}
            aria-current={area === current ? 'page' : undefined}
            className={`rounded-md px-1 py-1.5 text-center text-[11px] font-semibold transition ${
              area === current ? 'bg-white text-primary' : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
