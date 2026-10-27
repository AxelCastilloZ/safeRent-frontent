import { errorMessage } from '../../../i18n/messages';
import { currentLocale } from '../../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { useState } from 'react'
import { Star } from 'lucide-react'
import { ratingSummary } from '../utils/ratings'
import { useAuth } from '../../Auth/hooks/authHooks'
import { useCreatePropertyComment, useOwnPropertyComment, usePropertyComments } from '../hooks/usePropertyComments'

export default function PropertyComments({ propertyId, tenantId }: { propertyId: number; tenantId?: number | null }) {
  useTranslation();
  const { user } = useAuth()
  const comments = usePropertyComments(propertyId)
  const create = useCreatePropertyComment(propertyId)
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(0)
  const summary = ratingSummary(comments.data ?? [])
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
      <p className="mt-3 flex items-center gap-2 text-sm text-muted-ink">
        <Star size={18} aria-hidden="true" className="fill-amber-400 text-amber-500" />
        {summary.average === null ? i18n.t('comments:noRatings') : i18n.t('comments:ratingSummary', { average: summary.average.toLocaleString(currentLocale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }), count: summary.count })}
      </p>
      {!comments.data.length && <p className="mt-3 text-sm text-neutral/70">{i18n.t("comments:propertycomments_todavia_no_hay_comentarios")}</p>}
      <ul className="mt-4 space-y-4">
        {comments.data.map((comment) => <li key={comment.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">{comment.author.name}</span>
            <time dateTime={comment.createdAt} className="text-xs text-neutral/60">{new Date(comment.createdAt).toLocaleDateString(currentLocale())}</time>
          </div>
          {comment.rating != null && <p className="mt-2 flex gap-1 text-amber-500" aria-label={i18n.t('comments:ratingValue', { count: comment.rating })}>
            {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} aria-hidden="true" className={star <= comment.rating! ? 'fill-amber-400' : 'text-slate-300'} />)}
          </p>}
          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-neutral">{comment.content}</p>
        </li>)}
      </ul>
      {canComment && <form noValidate className="mt-5 space-y-3" onSubmit={(event) => {
        event.preventDefault()
        if (!content.trim() || rating === 0 || create.isPending) return
        create.mutate({ content: content.trim(), rating }, { onSuccess: () => { setContent(''); setRating(0) } })
      }}>
        <fieldset disabled={create.isPending}>
          <legend className="text-sm font-semibold">{i18n.t('comments:yourRating')}</legend>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map(star => <label key={star} className="relative cursor-pointer rounded-lg p-2 text-amber-500 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-secondary">
              <input className="absolute inset-0 size-full cursor-pointer opacity-0" type="radio" name="property-rating" value={star} checked={rating === star} onChange={() => setRating(star)} aria-label={i18n.t('comments:ratingValue', { count: star })} />
              <Star size={24} aria-hidden="true" className={`pointer-events-none ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`} />
            </label>)}
          </div>
        </fieldset>
        <label htmlFor="property-comment" className="block text-sm font-semibold">{i18n.t("comments:propertycomments_tu_comentario_sobre_esta_propiedad")}</label>
        <textarea id="property-comment" value={content} onChange={(event) => setContent(event.target.value)}
          required maxLength={1000} rows={4} disabled={create.isPending}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-secondary focus:outline-none"
          placeholder={i18n.t("comments:propertycomments_cuentanos_tu_experiencia_con_la_propiedad")} />
        {create.isError && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={create.isPending || !content.trim() || rating === 0}
          className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-secondary-dark disabled:opacity-50">
          {create.isPending ? i18n.t("comments:propertycomments_publicando") : i18n.t("comments:propertycomments_publicar_comentario")}
        </button>
      </form>}
      {alreadyCommented && <p role="status" className="mt-3 text-sm text-secondary-dark">{ownComment.data?.hidden ? i18n.t("comments:propertycomments_tu_comentario_fue_ocultado_por_administracion") : i18n.t("comments:propertycomments_ya_publicaste_tu_comentario_sobre_esta_propiedad")}</p>}
    </>}
  </section>
}
