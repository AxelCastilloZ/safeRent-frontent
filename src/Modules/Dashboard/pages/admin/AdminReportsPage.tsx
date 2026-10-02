import { Flag } from 'lucide-react';
import EmptyPanel from '../../Components/EmptyPanel';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import PendingNotice from '../../Components/PendingNotice';

/** Reportes (admin): pantalla lista; el backend no tiene módulo de reportes. */
export default function AdminReportsPage() {
  return (
    <PageContainer>
      <PageHeader title="Reportes" description="Reportes de usuarios y contenido que requieren moderación." />
      <EmptyPanel icon={Flag} title="No hay reportes pendientes" description="Los reportes enviados por los usuarios aparecerán aquí para su revisión." />
      <div className="mt-3">
        <PendingNotice>reportes y moderación — no existe el módulo en el backend.</PendingNotice>
      </div>
    </PageContainer>
  );
}
