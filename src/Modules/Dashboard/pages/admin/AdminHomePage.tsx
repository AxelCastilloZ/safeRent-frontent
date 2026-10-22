import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { Building2, ClipboardCheck, MessageSquare, Mail, Settings, Users } from 'lucide-react';
import { useAdminComments } from '../../../Comments/hooks/useAdminComments';
import { useAuth } from '../../../Auth/hooks/authHooks';
import { useAdminProperties } from '../../../Property/hooks/useAdminProperties';
import { useAdminUsers } from '../../../Users/hooks/useAdminUsers';
import PendingReviewSection from '../../Components/AdminHome/PendingReviewSection';
import RecentUsersSection from '../../Components/AdminHome/RecentUsersSection';
import RecentConversationsSection from '../../Components/ClientHome/RecentConversationsSection';
import HomeAction from '../../Components/HomeAction';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import StatCard from '../../Components/StatCard';
import StatGrid from '../../Components/StatGrid';
import { useAdminReviewQueue } from '../../hooks/useAdminReviewQueue';

/** Resumen del panel administrativo: cifras reales, la cola de revisión y la actividad reciente. */
export default function AdminHomePage() {
  useTranslation();
  const { user } = useAuth();
  const users = useAdminUsers();
  const active = useAdminProperties('ACTIVE');
  const review = useAdminReviewQueue();
  const comments = useAdminComments(Boolean(user?.roles.includes('ADMIN')));
  const hiddenComments = comments.data?.filter((comment) => comment.hidden).length;

  return (
    <PageContainer>
      <PageHeader
        title={i18n.t("dashboard:adminhomepage_resumen_del_sistema")}
        description={i18n.t("dashboard:adminhomepage_vista_general_de_usuarios_propiedades_y_acciones_pendientes")}
        actions={
          <>
            <HomeAction to="/dashboard/admin/properties" icon={ClipboardCheck} primary>{i18n.t("dashboard:adminhomepage_revisar_propiedades")}</HomeAction>
            <HomeAction to="/dashboard/admin/comments" icon={MessageSquare}>{i18n.t("dashboard:adminhomepage_moderar_comentarios")}</HomeAction>
            <HomeAction to="/dashboard/admin/users" icon={Users}>{i18n.t("dashboard:adminhomepage_usuarios")}</HomeAction>
            <HomeAction to="/dashboard/admin/messages" icon={Mail}>{i18n.t("dashboard:adminhomepage_mensajes")}</HomeAction>
            <HomeAction to="/admin/services" icon={Settings}>{i18n.t("dashboard:adminhomepage_servicios")}</HomeAction>
          </>
        }
      />

      <StatGrid columns={4}>
        <StatCard
          to="/dashboard/admin/users"
          label={i18n.t("dashboard:adminhomepage_usuarios")}
          icon={Users}
          value={users.isError ? '—' : users.data?.length}
          isLoading={users.isPending}
        />
        <StatCard
          to="/dashboard/admin/properties"
          label={i18n.t("dashboard:adminhomepage_propiedades_activas")}
          icon={Building2}
          value={active.isError ? '—' : active.data?.total}
          isLoading={active.isPending}
        />
        <StatCard
          to="/dashboard/admin/properties"
          label={i18n.t("dashboard:pendingreviewsection_pendientes_de_revision")}
          icon={ClipboardCheck}
          value={review.isError ? '—' : review.data?.total}
          isLoading={review.isPending}
        />
        <StatCard
          to="/dashboard/admin/comments"
          label={i18n.t("comments:admincommentspage_comentarios")}
          icon={MessageSquare}
          value={comments.isError ? '—' : comments.data?.length}
          isLoading={comments.isPending}
          hint={hiddenComments === undefined || comments.isError ? undefined : i18n.t('common:hiddenCount', { count: hiddenComments })}
        />
      </StatGrid>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PendingReviewSection />
        <RecentConversationsSection
          basePath="/dashboard/admin/messages"
          title={i18n.t("dashboard:adminhomepage_mensajes_recientes")}
          emptyDescription="Inicia una conversación directa con un usuario desde la lista de usuarios."
          emptyAction={{ label: i18n.t("dashboard:adminhomepage_ir_a_usuarios"), to: '/dashboard/admin/users' }}
        />
      </div>
      <div className="mt-6">
        <RecentUsersSection />
      </div>
    </PageContainer>
  );
}
