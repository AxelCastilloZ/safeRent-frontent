import { Building2, ClipboardCheck, Flag, Users } from 'lucide-react';
import EmptyPanel from '../../Components/EmptyPanel';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import PendingNotice from '../../Components/PendingNotice';
import StatCard from '../../Components/StatCard';
import { useAdminUsers } from '../../../Users/hooks/useAdminUsers';
import { useAdminProperties } from '../../../Property/hooks/useAdminProperties';

/** Resumen del panel administrativo: usuarios, propiedades activas y pendientes de revisión reales. */
export default function AdminHomePage() {
  const users = useAdminUsers();
  const active = useAdminProperties('ACTIVE');
  const pending = useAdminProperties('PENDING');

  return (
    <PageContainer>
      <PageHeader title="Resumen del sistema" description="Vista general de usuarios, propiedades y acciones pendientes." />

      <section aria-label="Resumen" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Usuarios"
          icon={Users}
          value={users.isError ? '—' : users.data?.length}
          isLoading={users.isPending}
        />
        <StatCard
          label="Propiedades activas"
          icon={Building2}
          value={active.isError ? '—' : active.data?.total}
          isLoading={active.isPending}
        />
        <StatCard
          label="Pendientes de revisión"
          icon={ClipboardCheck}
          value={pending.isError ? '—' : pending.data?.total}
          isLoading={pending.isPending}
        />
        <StatCard label="Reportes pendientes" icon={Flag} />
      </section>

      <section aria-labelledby="pending-actions" className="mt-8">
        <h2 id="pending-actions" className="mb-3 text-lg font-bold">
          Acciones pendientes
        </h2>
        {pending.data?.data.length ? (
          <ul className="space-y-2">
            {pending.data.data.slice(0, 5).map((property) => (
              <li key={property.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-primary">{property.title}</p>
                  <p className="truncate text-xs text-muted-ink">{property.owner.name} {property.owner.surname1}</p>
                </div>
                <a href="/dashboard/admin/properties" className="shrink-0 text-xs font-bold text-secondary hover:underline">
                  Revisar
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyPanel
            icon={ClipboardCheck}
            title="Sin acciones pendientes"
            description="Aquí aparecen las propiedades esperando aprobación."
          />
        )}
        <div className="mt-3">
          <PendingNotice>reportes y moderación de contenido — ese módulo no existe en el backend.</PendingNotice>
        </div>
      </section>
    </PageContainer>
  );
}
