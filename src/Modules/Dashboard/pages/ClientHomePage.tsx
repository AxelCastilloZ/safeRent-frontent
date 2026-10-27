import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { CalendarCheck, Heart, MessageSquare, PlusCircle, Search } from 'lucide-react';
import { useConversations, useUnreadMessagesCount } from '../../Messages/hooks/messageHooks';
import { useSavedPropertyIds } from '../../SavedProperties/hooks/savedPropertyHooks';
import DiscoverSection from '../Components/ClientHome/DiscoverSection';
import RecentConversationsSection from '../Components/ClientHome/RecentConversationsSection';
import RecentSavedSection from '../Components/ClientHome/RecentSavedSection';
import ReservedPropertySection from '../Components/ClientHome/ReservedPropertySection';
import UpcomingVisitsSection from '../Components/VisitsHome/UpcomingVisitsSection';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import HomeAction from '../Components/HomeAction';
import StatCard from '../Components/StatCard';
import StatGrid from '../Components/StatGrid';
import { useDashboardUser } from '../hooks/useDashboardUser';
import { useTenantProperties } from '../hooks/useTenantProperties';

/** Inicio del panel del inquilino: resumen, lo que tiene en curso y propiedades para descubrir. */
export default function ClientHomePage() {
  useTranslation();
  const { firstName } = useDashboardUser();
  const properties = useTenantProperties();
  const conversations = useConversations();
  const unreadMessages = useUnreadMessagesCount();
  const savedIds = useSavedPropertyIds();

  return (
    <PageContainer>
      <PageHeader
        title={firstName ? i18n.t("dashboard:clienthomepage_hola_a1c317", { v0: firstName }) : i18n.t("dashboard:clienthomepage_hola_e633f4")}
        description={i18n.t("dashboard:clienthomepage_este_es_el_resumen_de_tu_actividad_en_saferent")}
        actions={
          <>
            <HomeAction to="/explorar" icon={Search} primary>{i18n.t("about:aboutcta_explorar_propiedades")}</HomeAction>
            <HomeAction to="/dashboard/messages" icon={MessageSquare}>{i18n.t("dashboard:adminhomepage_mensajes")}</HomeAction>
            <HomeAction to="/publicar" icon={PlusCircle}>{i18n.t("dashboard:clienthomepage_publicar_propiedad")}</HomeAction>
          </>
        }
      />

      <StatGrid columns={3}>
        <StatCard
          to="/dashboard/reservations"
          label={i18n.t("dashboard:ownerreservedsection_propiedades_reservadas")}
          icon={CalendarCheck}
          value={properties.isError ? '—' : properties.data?.length}
          isLoading={properties.isPending}
        />
        <StatCard
          to="/dashboard/messages"
          label={i18n.t("dashboard:clienthomepage_mensajes_sin_leer")}
          icon={MessageSquare}
          value={conversations.isError ? '—' : unreadMessages}
          isLoading={conversations.isPending}
          hint={conversations.data && i18n.t('common:conversationsCount', { count: conversations.data.length })}
        />
        <StatCard
          to="/dashboard/saved"
          label={i18n.t("dashboard:clienthomepage_propiedades_guardadas")}
          icon={Heart}
          value={savedIds.isError ? '—' : savedIds.data?.length}
          isLoading={savedIds.isPending}
        />
      </StatGrid>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ReservedPropertySection />
        <UpcomingVisitsSection role="tenant" />
      </div>
      <div className="mt-6 space-y-6">
        <RecentConversationsSection />
        <RecentSavedSection />
        <DiscoverSection />
      </div>
    </PageContainer>
  );
}
