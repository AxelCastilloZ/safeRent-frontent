import { Link } from '@tanstack/react-router';
import { Building2, ClipboardCheck, Settings, Users } from 'lucide-react';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
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
        {/* <StatCard label="Reportes pendientes" icon={Flag} /> */}
      </section>

      <section aria-labelledby="quick-actions" className="mt-8">
        <h2 id="quick-actions" className="mb-3 text-lg font-bold">
          Acciones rápidas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link to="/admin/services" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-primary shadow-sm transition hover:border-secondary">
            <Settings size={20} className="text-secondary" aria-hidden="true" />
            Gestionar servicios
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}
