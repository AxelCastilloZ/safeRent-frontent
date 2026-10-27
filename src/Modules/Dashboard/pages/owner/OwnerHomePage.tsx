import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { Building2, CalendarCheck, FileEdit, MessageSquare, Plus } from 'lucide-react';
import { useConversations, useUnreadMessagesCount } from '../../../Messages/hooks/messageHooks';
import RecentConversationsSection from '../../Components/ClientHome/RecentConversationsSection';
import HomeAction from '../../Components/HomeAction';
import AttentionSection from '../../Components/OwnerHome/AttentionSection';
import PendingVisitsSection from '../../Components/VisitsHome/PendingVisitsSection';
import UpcomingVisitsSection from '../../Components/VisitsHome/UpcomingVisitsSection';
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
  useTranslation();
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
        title={firstName ? i18n.t("dashboard:clienthomepage_hola_a1c317", { v0: firstName }) : i18n.t("dashboard:clienthomepage_hola_e633f4")}
        description={i18n.t("dashboard:ownerhomepage_resumen_de_tus_propiedades_y_de_tu_actividad")}
        actions={
          <>
            <HomeAction to="/dashboard/owner/properties/new" icon={Plus} primary>{i18n.t("dashboard:clienthomepage_publicar_propiedad")}</HomeAction>
            <HomeAction to="/dashboard/owner/properties" icon={Building2}>{i18n.t("dashboard:ownerhomepage_mis_propiedades")}</HomeAction>
            <HomeAction to="/dashboard/owner/messages" icon={MessageSquare}>{i18n.t("dashboard:adminhomepage_mensajes")}</HomeAction>
          </>
        }
      />

      <StatGrid columns={4}>
        <StatCard
          to="/dashboard/owner/properties"
          label={i18n.t("dashboard:ownerhomepage_propiedades_publicadas")}
          icon={Building2}
          value={properties.isError ? '—' : published}
          isLoading={properties.isPending}
        />
        <StatCard
          to="/dashboard/owner/properties"
          label={i18n.t("dashboard:adminpropertiespage_en_revision")}
          icon={FileEdit}
          value={properties.isError ? '—' : inReview}
          isLoading={properties.isPending}
          hint={i18n.t("dashboard:ownerhomepage_esperando_al_administrador")}
        />
        <StatCard
          to="/dashboard/owner/properties"
          label={i18n.t("dashboard:ownerreservedsection_propiedades_reservadas")}
          icon={CalendarCheck}
          value={properties.isError ? '—' : reserved}
          isLoading={properties.isPending}
        />
        <StatCard
          to="/dashboard/owner/messages"
          label={i18n.t("dashboard:clienthomepage_mensajes_sin_leer")}
          icon={MessageSquare}
          value={conversations.isError ? '—' : unreadMessages}
          isLoading={conversations.isPending}
          hint={conversations.data && i18n.t('common:conversationsCount', { count: conversations.data.length })}
        />
      </StatGrid>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PendingVisitsSection />
        <UpcomingVisitsSection role="owner" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AttentionSection />
        <RecentConversationsSection
          basePath="/dashboard/owner/messages"
          emptyDescription={i18n.t("dashboard:ownerConversationHelp")}
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
