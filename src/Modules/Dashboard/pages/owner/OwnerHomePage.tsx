import { Link } from '@tanstack/react-router';
import { Building2, ClipboardList, FileEdit, MessageSquare, Plus } from 'lucide-react';
import { useConversations } from '../../../Messages/hooks/messageHooks';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import PendingNotice from '../../Components/PendingNotice';
import StatCard from '../../Components/StatCard';
import { useDashboardUser } from '../../hooks/useDashboardUser';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';

const quickActionClass =
  'flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-primary shadow-sm transition hover:border-secondary';

/** Inicio del panel del propietario: cifras reales de sus propiedades y mensajes, y accesos rápidos. */
export default function OwnerHomePage() {
  const { firstName } = useDashboardUser();
  const properties = useOwnerProperties();
  const conversations = useConversations();

  const published = properties.data?.filter((property) => property.isActive).length;
  const unpublished = properties.data?.filter((property) => !property.isActive).length;

  return (
    <PageContainer>
      <PageHeader title={firstName ? `Hola, ${firstName}` : 'Hola'} description="Resumen de tus propiedades y de tu actividad." />

      <section aria-label="Resumen" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Propiedades publicadas"
          icon={Building2}
          value={properties.isError ? '—' : published}
          isLoading={properties.isPending}
        />
        <StatCard
          label="Sin publicar"
          icon={FileEdit}
          value={properties.isError ? '—' : unpublished}
          isLoading={properties.isPending}
          hint="Borradores e inactivas"
        />
        <StatCard label="Solicitudes de reservación" icon={ClipboardList} />
        <StatCard
          label="Conversaciones"
          icon={MessageSquare}
          value={conversations.isError ? '—' : conversations.data?.length}
          isLoading={conversations.isPending}
          hint="Mensajes sin leer: pendiente de integrar"
        />
      </section>

      <section aria-labelledby="quick-actions" className="mt-8">
        <h2 id="quick-actions" className="mb-3 text-lg font-bold">
          Acciones rápidas
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link to="/properties/new" className={quickActionClass}>
            <Plus size={20} className="text-secondary" aria-hidden="true" />
            Publicar propiedad
          </Link>
          <Link to="/dashboard/owner/properties" className={quickActionClass}>
            <Building2 size={20} className="text-secondary" aria-hidden="true" />
            Ver mis propiedades
          </Link>
          <Link to="/dashboard/owner/requests" className={quickActionClass}>
            <ClipboardList size={20} className="text-secondary" aria-hidden="true" />
            Ver solicitudes
          </Link>
          <Link to="/dashboard/owner/messages" className={quickActionClass}>
            <MessageSquare size={20} className="text-secondary" aria-hidden="true" />
            Mensajes
          </Link>
        </div>
      </section>

      <div className="mt-8">
        <PendingNotice>
          «publicadas» y «sin publicar» salen de isActive. El flujo borrador → en revisión → aprobada y las solicitudes de reservación no existen en el backend.
        </PendingNotice>
      </div>
    </PageContainer>
  );
}
