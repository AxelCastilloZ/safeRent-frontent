import { Building2, ClipboardCheck, Flag, Users } from 'lucide-react';
import EmptyPanel from '../../Components/EmptyPanel';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import PendingNotice from '../../Components/PendingNotice';
import StatCard from '../../Components/StatCard';

/** Resumen del panel administrativo. Todas las cifras están pendientes: no hay endpoints de administración. */
export default function AdminHomePage() {
  return (
    <PageContainer>
      <PageHeader title="Resumen del sistema" description="Vista general de usuarios, propiedades y acciones pendientes." />

      <section aria-label="Resumen" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Usuarios" icon={Users} />
        <StatCard label="Propiedades activas" icon={Building2} />
        <StatCard label="Pendientes de revisión" icon={ClipboardCheck} />
        <StatCard label="Reportes pendientes" icon={Flag} />
      </section>

      <section aria-labelledby="pending-actions" className="mt-8">
        <h2 id="pending-actions" className="mb-3 text-lg font-bold">
          Acciones pendientes
        </h2>
        <EmptyPanel
          icon={ClipboardCheck}
          title="Sin acciones pendientes"
          description="Aquí aparecerán las propiedades esperando aprobación y los reportes por atender."
        />
        <div className="mt-3">
          <PendingNotice>
            métricas y acciones de administración — falta definir endpoints protegidos para administradores y el flujo de revisión de propiedades.
          </PendingNotice>
        </div>
      </section>
    </PageContainer>
  );
}
