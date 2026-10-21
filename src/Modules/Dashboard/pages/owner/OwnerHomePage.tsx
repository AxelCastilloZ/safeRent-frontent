import { Building2, CalendarCheck, FileEdit, MessageSquare, Plus } from 'lucide-react';
import { useConversations, useUnreadMessagesCount } from '../../../Messages/hooks/messageHooks';
import RecentConversationsSection from '../../Components/ClientHome/RecentConversationsSection';
import HomeAction from '../../Components/HomeAction';
import AttentionSection from '../../Components/OwnerHome/AttentionSection';
import OwnerReservedSection from '../../Components/OwnerHome/OwnerReservedSection';
import RecentOwnerPropertiesSection from '../../Components/OwnerHome/RecentOwnerPropertiesSection';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import StatCard from '../../Components/StatCard';
import StatGrid from '../../Components/StatGrid';
import { useDashboardUser } from '../../hooks/useDashboardUser';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';

/** Inicio del panel del propietario: cifras reales, lo que necesita atención y sus propiedades. */
export default function OwnerHomePage() {
  const { firstName } = useDashboardUser();
  const properties = useOwnerProperties();
  const conversations = useConversations();
  const unreadMessages = useUnreadMessagesCount();

  const published = properties.data?.filter((property) => property.status === 'ACTIVE').length;
  const inReview = properties.data?.filter((property) => property.status === 'PENDING').length;
  const reserved = properties.data?.filter((property) => property.reservedTenantId).length;

  return (
    <PageContainer>
      <PageHeader
        title={firstName ? `Hola, ${firstName}` : 'Hola'}
        description="Resumen de tus propiedades y de tu actividad."
        actions={
          <>
            <HomeAction to="/dashboard/owner/properties/new" icon={Plus} primary>Publicar propiedad</HomeAction>
            <HomeAction to="/dashboard/owner/properties" icon={Building2}>Mis propiedades</HomeAction>
            <HomeAction to="/dashboard/owner/messages" icon={MessageSquare}>Mensajes</HomeAction>
          </>
        }
      />

      <StatGrid columns={4}>
        <StatCard
          to="/dashboard/owner/properties"
          label="Propiedades publicadas"
          icon={Building2}
          value={properties.isError ? '—' : published}
          isLoading={properties.isPending}
        />
        <StatCard
          to="/dashboard/owner/properties"
          label="En revisión"
          icon={FileEdit}
          value={properties.isError ? '—' : inReview}
          isLoading={properties.isPending}
          hint="Esperando al administrador"
        />
        <StatCard
          to="/dashboard/owner/properties"
          label="Propiedades reservadas"
          icon={CalendarCheck}
          value={properties.isError ? '—' : reserved}
          isLoading={properties.isPending}
        />
        <StatCard
          to="/dashboard/owner/messages"
          label="Mensajes sin leer"
          icon={MessageSquare}
          value={conversations.isError ? '—' : unreadMessages}
          isLoading={conversations.isPending}
          hint={conversations.data && `En ${conversations.data.length} ${conversations.data.length === 1 ? 'conversación' : 'conversaciones'}`}
        />
      </StatGrid>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AttentionSection />
        <RecentConversationsSection
          basePath="/dashboard/owner/messages"
          emptyDescription="Cuando un interesado te escriba desde una de tus propiedades, la conversación aparecerá aquí."
          emptyAction={null}
        />
      </div>
      <div className="mt-6 space-y-6">
        <RecentOwnerPropertiesSection />
        <OwnerReservedSection />
      </div>
    </PageContainer>
  );
}
