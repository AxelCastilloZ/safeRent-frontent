import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { useParams } from '@tanstack/react-router'
import ChatPanel from '../Components/ChatPanel'

/** /messages/$conversationId — la pantalla para chatear con el arrendador (o el inquilino). */
export default function ConversationPage() {
  useTranslation();
  const { conversationId } = useParams({ strict: false })
  const id = Number(conversationId)

  if (!Number.isInteger(id) || id <= 0) {
    return <p role="alert" className="flex h-full items-center justify-center p-8 text-slate-500">{i18n.t("messages:conversationpage_conversacion_no_valida")}</p>
  }

  // key: al cambiar de conversación se reinicia el estado local (cola de envío, scroll).
  return <ChatPanel key={id} conversationId={id} />
}
