import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { MessageSquare } from 'lucide-react'

/** Panel derecho de /messages cuando todavía no se eligió una conversación (wireframe 3a). */
export default function MessagesIndexPage() {
  useTranslation();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-slate-500">
      <MessageSquare className="size-10" aria-hidden="true" />
      <p>{i18n.t("messages:messagesindexpage_escoge_una_conversacion_para_ver_los_mensajes")}</p>
    </div>
  )
}
