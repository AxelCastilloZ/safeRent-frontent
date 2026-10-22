import { errorMessage } from '../../../i18n/messages';
import { currentLocale } from '../../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { useState } from 'react'
import { useAuth } from '../../Auth/hooks/authHooks'
import { useCreatePropertyComment, useOwnPropertyComment, usePropertyComments } from '../hooks/usePropertyComments'

export default function PropertyComments({ propertyId, tenantId }: { propertyId: number; tenantId?: number | null }) {
  useTranslation();
  const { user } = useAuth()
  const comments = usePropertyComments(propertyId)
  const create = useCreatePropertyComment(propertyId)
  const [content, setContent] = useState('')
  const ownComment = useOwnPropertyComment(propertyId, user?.id)
  const alreadyCommented = Boolean(ownComment.data)
  const canComment = user?.id === tenantId && Boolean(user) && ownComment.isSuccess && !alreadyCommented
  const error = errorMessage(create.error, i18n.t("comments:propertycomments_no_se_pudo_publicar_el_comentario_intenta_nuevamente"))

  return <section className="mt-8 border-t border-slate-200 pt-6">
    <h2 className="text-xl font-bold">{i18n.t("comments:propertycomments_comentarios_de_inquilinos")}</h2>
    {comments.isPending && <p role="status" className="mt-3 text-sm text-neutral/70">{i18n.t("comments:propertycomments_cargando_comentarios")}</p>}
    {comments.isError && <div role="alert" className="mt-3 text-sm text-red-700">{i18n.t("comments:propertycomments_no_se_pudieron_cargar_los_comentarios")}<button type="button" onClick={() => void comments.refetch()} className="ml-2 font-semibold underline">{i18n.t("comments:propertycomments_reintentar")}</button>
    </div>}
    {comments.isSuccess && <>
      {!comments.data.length && <p className="mt-3 text-sm text-neutral/70">{i18n.t("comments:propertycomments_todavia_no_hay_comentarios")}</p>}
      <ul className="mt-4 space-y-4">
        {comments.data.map((comment) => <li key={comment.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">{comment.author.name}</span>
            <time dateTime={comment.createdAt} className="text-xs text-neutral/60">{new Date(comment.createdAt).toLocaleDateString(currentLocale())}</time>
          </div>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-neutral">{comment.content}</p>
        </li>)}
      </ul>
      {canComment && <form noValidate className="mt-5 space-y-3" onSubmit={(event) => {
        event.preventDefault()
        if (!content.trim() || create.isPending) return
        create.mutate(content.trim(), { onSuccess: () => setContent('') })
      }}>
        <label htmlFor="property-comment" className="block text-sm font-semibold">{i18n.t("comments:propertycomments_tu_comentario_sobre_esta_propiedad")}</label>
        <textarea id="property-comment" value={content} onChange={(event) => setContent(event.target.value)}
          required maxLength={1000} rows={4} disabled={create.isPending}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-secondary focus:outline-none"
          placeholder={i18n.t("comments:propertycomments_cuentanos_tu_experiencia_con_la_propiedad")} />
        {create.isError && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={create.isPending || !content.trim()}
          className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-secondary-dark disabled:opacity-50">
          {create.isPending ? i18n.t("comments:propertycomments_publicando") : i18n.t("comments:propertycomments_publicar_comentario")}
        </button>
      </form>}
      {alreadyCommented && <p role="status" className="mt-3 text-sm text-secondary-dark">{ownComment.data?.hidden ? i18n.t("comments:propertycomments_tu_comentario_fue_ocultado_por_administracion") : i18n.t("comments:propertycomments_ya_publicaste_tu_comentario_sobre_esta_propiedad")}</p>}
    </>}
  </section>
}
