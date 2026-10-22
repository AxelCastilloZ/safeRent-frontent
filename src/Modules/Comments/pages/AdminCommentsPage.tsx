import { errorMessage } from '../../../i18n/messages';
import { currentLocale } from '../../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { useState } from 'react'
import { useAuth } from '../../Auth/hooks/authHooks'
import PageContainer from '../../Dashboard/Components/PageContainer'
import PageHeader from '../../Dashboard/Components/PageHeader'
import { useAdminComments, useModerateComment } from '../hooks/useAdminComments'
import type { AdminPropertyComment } from '../models/comment'

export default function AdminCommentsPage() {
  useTranslation();
  const { user } = useAuth()
  const isAdmin = Boolean(user?.roles.includes('ADMIN'))
  const comments = useAdminComments(isAdmin)
  const moderate = useModerateComment()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AdminPropertyComment | null>(null)
  const [note, setNote] = useState('')
  const error = errorMessage(moderate.error, i18n.t("comments:admincommentspage_no_se_pudo_actualizar_el_comentario"))
  const list = (comments.data ?? []).filter((comment) =>
    (filter === 'all' || comment.hidden === (filter === 'hidden')) &&
    [comment.content, comment.property.title, comment.author.name].join(' ').toLowerCase().includes(search.trim().toLowerCase()))

  if (!user) return <p role="status">{i18n.t("comments:admincommentspage_verificando_sesion")}</p>
  if (!isAdmin) return <p role="alert">{i18n.t("comments:admincommentspage_solo_los_administradores_pueden_gestionar_comentarios")}</p>

  return <PageContainer>
    <PageHeader title={i18n.t("comments:admincommentspage_comentarios")} description={i18n.t("comments:admincommentspage_revisa_los_comentarios_de_las_propiedades_puedes_ocultarlos_con")} />
    <div className="mb-5 flex flex-wrap gap-3">
      <input aria-label={i18n.t("comments:admincommentspage_buscar_comentarios")} value={search} onChange={(event) => setSearch(event.target.value)}
        placeholder={i18n.t("comments:admincommentspage_buscar_por_propiedad_autor_o_comentario")} className="min-w-60 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" />
      <select aria-label={i18n.t("comments:admincommentspage_estado_del_comentario")} value={filter} onChange={(event) => setFilter(event.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
        <option value="all">{i18n.t("comments:admincommentspage_todos")}</option><option value="visible">{i18n.t("comments:admincommentspage_visibles")}</option><option value="hidden">{i18n.t("comments:admincommentspage_ocultos")}</option>
      </select>
    </div>
    {comments.isPending && <p role="status">{i18n.t("comments:propertycomments_cargando_comentarios")}</p>}
    {comments.isError && <p role="alert" className="text-red-700">{i18n.t("comments:admincommentspage_no_pudimos_cargar_los_comentarios")}<button type="button" onClick={() => void comments.refetch()} className="ml-2 underline">{i18n.t("comments:propertycomments_reintentar")}</button>
    </p>}
    {moderate.isError && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
    {comments.isSuccess && !list.length && <p className="py-8 text-center text-slate-500">{i18n.t("comments:admincommentspage_no_hay_comentarios_para_mostrar")}</p>}
    <ul className="space-y-4">
      {list.map((comment) => <li key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="font-bold">{comment.property.title}</h2>
            <p className="text-sm text-slate-500">{comment.author.name} · {new Date(comment.createdAt).toLocaleDateString(currentLocale())}</p>
          </div>
          <span className={comment.hidden ? 'text-sm font-semibold text-amber-700' : 'text-sm font-semibold text-green-700'}>{comment.hidden ? i18n.t("comments:admincommentspage_oculto") : i18n.t("comments:admincommentspage_visible")}</span>
        </div>
        <p className="my-4 whitespace-pre-wrap break-words text-sm">{comment.content}</p>
        {comment.hidden && <p className="mb-3 text-sm text-slate-500">{i18n.t("comments:admincommentspage_motivo")}{' '}{comment.moderationNote}</p>}
        {selected?.id === comment.id ? <form className="space-y-2" onSubmit={(event) => {
          event.preventDefault()
          if (!note.trim() || moderate.isPending) return
          moderate.mutate({ id: comment.id, data: { hidden: true, note: note.trim() } }, { onSuccess: () => { setSelected(null); setNote('') } })
        }}>
          <label htmlFor="moderation-note" className="block text-sm font-semibold">{i18n.t("comments:admincommentspage_motivo_para_ocultarlo")}</label>
          <textarea id="moderation-note" required maxLength={500} rows={3} value={note}
            disabled={moderate.isPending} onChange={(event) => setNote(event.target.value)}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm" />
          <div className="flex gap-2">
            <button type="submit" disabled={moderate.isPending || !note.trim()} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{i18n.t("comments:admincommentspage_ocultar_comentario")}</button>
            <button type="button" disabled={moderate.isPending} onClick={() => { setSelected(null); moderate.reset() }} className="rounded-lg border px-3 py-2 text-sm">{i18n.t("comments:admincommentspage_cancelar")}</button>
          </div>
        </form> : <button type="button" disabled={moderate.isPending} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-50"
          onClick={() => {
            moderate.reset()
            if (comment.hidden) moderate.mutate({ id: comment.id, data: { hidden: false } })
            else { setSelected(comment); setNote('') }
          }}>{moderate.isPending && moderate.variables?.id === comment.id ? i18n.t("comments:admincommentspage_guardando") : comment.hidden ? i18n.t("comments:admincommentspage_restaurar_comentario") : i18n.t("comments:admincommentspage_ocultar_comentario")}</button>}
      </li>)}
    </ul>
  </PageContainer>
}
