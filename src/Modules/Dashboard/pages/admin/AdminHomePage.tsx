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
  const { user } = useAuth();
  const users = useAdminUsers();
  const active = useAdminProperties('ACTIVE');
  const review = useAdminReviewQueue();
  const comments = useAdminComments(Boolean(user?.roles.includes('ADMIN')));
  const hiddenComments = comments.data?.filter((comment) => comment.hidden).length;

  return (
    <PageContainer>
      <PageHeader
        title="Resumen del sistema"
        description="Vista general de usuarios, propiedades y acciones pendientes."
        actions={
          <>
            <HomeAction to="/dashboard/admin/properties" icon={ClipboardCheck} primary>Revisar propiedades</HomeAction>
            <HomeAction to="/dashboard/admin/comments" icon={MessageSquare}>Moderar comentarios</HomeAction>
            <HomeAction to="/dashboard/admin/users" icon={Users}>Usuarios</HomeAction>
            <HomeAction to="/dashboard/admin/messages" icon={Mail}>Mensajes</HomeAction>
            <HomeAction to="/admin/services" icon={Settings}>Servicios</HomeAction>
          </>
        }
      />

      <StatGrid columns={4}>
        <StatCard
          to="/dashboard/admin/users"
          label="Usuarios"
          icon={Users}
          value={users.isError ? '—' : users.data?.length}
          isLoading={users.isPending}
        />
        <StatCard
          to="/dashboard/admin/properties"
          label="Propiedades activas"
          icon={Building2}
          value={active.isError ? '—' : active.data?.total}
          isLoading={active.isPending}
        />
        <StatCard
          to="/dashboard/admin/properties"
          label="Pendientes de revisión"
          icon={ClipboardCheck}
          value={review.isError ? '—' : review.data?.total}
          isLoading={review.isPending}
        />
        <StatCard
          to="/dashboard/admin/comments"
          label="Comentarios"
          icon={MessageSquare}
          value={comments.isError ? '—' : comments.data?.length}
          isLoading={comments.isPending}
          hint={hiddenComments === undefined || comments.isError ? undefined : `${hiddenComments} ${hiddenComments === 1 ? 'oculto' : 'ocultos'} por moderación`}
        />
      </StatGrid>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PendingReviewSection />
        <RecentConversationsSection
          basePath="/dashboard/admin/messages"
          title="Mensajes recientes"
          emptyDescription="Inicia una conversación directa con un usuario desde la lista de usuarios."
          emptyAction={{ label: 'Ir a usuarios', to: '/dashboard/admin/users' }}
        />
      </div>
      <div className="mt-6">
        <RecentUsersSection />
      </div>
    </PageContainer>
  );
}
