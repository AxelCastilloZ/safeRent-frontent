import { CalendarCheck, Heart, MessageSquare, PlusCircle, Search } from 'lucide-react';
import { useConversations, useUnreadMessagesCount } from '../../Messages/hooks/messageHooks';
import { useSavedPropertyIds } from '../../SavedProperties/hooks/savedPropertyHooks';
import DiscoverSection from '../Components/ClientHome/DiscoverSection';
import RecentConversationsSection from '../Components/ClientHome/RecentConversationsSection';
import RecentSavedSection from '../Components/ClientHome/RecentSavedSection';
import ReservedPropertySection from '../Components/ClientHome/ReservedPropertySection';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import HomeAction from '../Components/HomeAction';
import StatCard from '../Components/StatCard';
import StatGrid from '../Components/StatGrid';
import { useDashboardUser } from '../hooks/useDashboardUser';
import { useTenantProperties } from '../hooks/useTenantProperties';

/** Inicio del panel del inquilino: resumen, lo que tiene en curso y propiedades para descubrir. */
export default function ClientHomePage() {
  const { firstName } = useDashboardUser();
  const properties = useTenantProperties();
  const conversations = useConversations();
  const unreadMessages = useUnreadMessagesCount();
  const savedIds = useSavedPropertyIds();

  return (
    <PageContainer>
      <PageHeader
        title={firstName ? `Hola, ${firstName}` : 'Hola'}
        description="Este es el resumen de tu actividad en SafeRent."
        actions={
          <>
            <HomeAction to="/explorar" icon={Search} primary>Explorar propiedades</HomeAction>
            <HomeAction to="/dashboard/messages" icon={MessageSquare}>Mensajes</HomeAction>
            <HomeAction to="/publicar" icon={PlusCircle}>Publicar propiedad</HomeAction>
          </>
        }
      />

      <StatGrid columns={3}>
        <StatCard
          to="/dashboard/reservations"
          label="Propiedades reservadas"
          icon={CalendarCheck}
          value={properties.isError ? '—' : properties.data?.length}
          isLoading={properties.isPending}
        />
        <StatCard
          to="/dashboard/messages"
          label="Mensajes sin leer"
          icon={MessageSquare}
          value={conversations.isError ? '—' : unreadMessages}
          isLoading={conversations.isPending}
          hint={conversations.data && `En ${conversations.data.length} ${conversations.data.length === 1 ? 'conversación' : 'conversaciones'}`}
        />
        <StatCard
          to="/dashboard/saved"
          label="Propiedades guardadas"
          icon={Heart}
          value={savedIds.isError ? '—' : savedIds.data?.length}
          isLoading={savedIds.isPending}
        />
      </StatGrid>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ReservedPropertySection />
        <RecentConversationsSection />
      </div>
      <div className="mt-6 space-y-6">
        <RecentSavedSection />
        <DiscoverSection />
      </div>
    </PageContainer>
  );
}
