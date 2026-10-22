import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { Link } from '@tanstack/react-router';
import { useAuth } from '../../../Auth/hooks/authHooks';
import ParticipantAvatar from '../../../Messages/Components/ParticipantAvatar';
import UnreadBadge from '../../../Messages/Components/UnreadBadge';
import { useConversations } from '../../../Messages/hooks/messageHooks';
import { conversationContext, otherParticipant, participantFullName, participantInitials, shortDate } from '../../../Messages/utils/conversation';
import HomeSection from '../HomeSection';
import { SectionEmpty, SectionError, SectionLoading } from './SectionStates';

const SHOWN = 3;

interface RecentConversationsSectionProps {
  /** Dónde vive Mensajes en el área del panel (cada rol tiene su propia ruta). */
  basePath?: string;
  title?: string;
  emptyDescription?: string;
  /** Acción sugerida cuando no hay conversaciones; sin ella el vacío solo informa. */
  emptyAction?: { label: string; to: string } | null;
}

/** "Conversaciones recientes": primero las que tienen mensajes sin leer, luego las más nuevas. */
export default function RecentConversationsSection({
  basePath = '/dashboard/messages',
  title = i18n.t("dashboard:recentconversationssection_conversaciones_recientes"),
  emptyDescription = i18n.t("dashboard:recentconversationssection_escribele_a_un_propietario_desde_la_pagina_de_una"),
  emptyAction = { label: i18n.t("about:aboutcta_explorar_propiedades"), to: '/explorar' },
}: RecentConversationsSectionProps = {}) {
  useTranslation();
  const { user } = useAuth();
  const conversations = useConversations();
  // sort es estable: dentro de cada grupo se conserva el orden del backend (más nueva primero).
  const recent = [...(conversations.data ?? [])]
    .sort((a, b) => Number((b.unreadCount ?? 0) > 0) - Number((a.unreadCount ?? 0) > 0))
    .slice(0, SHOWN);

  return (
    <HomeSection title={title} to={basePath} linkLabel={i18n.t("dashboard:goMessages")}>
      {conversations.isPending ? (
        <SectionLoading />
      ) : conversations.isError ? (
        <SectionError message={i18n.t("dashboard:recentconversationssection_no_pudimos_cargar_tus_conversaciones")} onRetry={() => void conversations.refetch()} />
      ) : recent.length === 0 ? (
        <SectionEmpty
          title={i18n.t("dashboard:recentconversationssection_aun_no_tienes_conversaciones")}
          description={emptyDescription}
          actionLabel={emptyAction?.label}
          actionTo={emptyAction?.to}
        />
      ) : (
        <ul className="-mx-2">
          {recent.map((conversation) => {
            const other = user ? otherParticipant(conversation, user.id) : undefined;
            const unread = conversation.unreadCount ?? 0;
            return (
              <li key={conversation.id}>
                <Link to={`${basePath}/${conversation.id}` as string} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50">
                  <ParticipantAvatar initials={other ? participantInitials(other) : '?'} />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm ${unread > 0 ? 'font-extrabold text-primary' : 'font-semibold'}`}>{other ? participantFullName(other) : i18n.t("dashboard:recentconversationssection_usuario")}</p>
                    <p className="truncate text-xs text-muted-ink">{user ? conversationContext(conversation, user.id) : (conversation.property?.title ?? '')}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-2 text-xs text-muted-ink">
                    <UnreadBadge count={unread} />
                    <time dateTime={conversation.createdAt}>{shortDate(conversation.createdAt)}</time>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </HomeSection>
  );
}
