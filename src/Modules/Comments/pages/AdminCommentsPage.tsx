import axios from 'axios'
import { useState } from 'react'
import { useAuth } from '../../Auth/hooks/authHooks'
import PageContainer from '../../Dashboard/Components/PageContainer'
import PageHeader from '../../Dashboard/Components/PageHeader'
import { useAdminComments, useModerateComment } from '../hooks/useAdminComments'
import type { AdminPropertyComment } from '../models/comment'

export default function AdminCommentsPage() {
  const { user } = useAuth()
  const isAdmin = Boolean(user?.roles.includes('ADMIN'))
  const comments = useAdminComments(isAdmin)
  const moderate = useModerateComment()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AdminPropertyComment | null>(null)
  const [note, setNote] = useState('')
  const message: unknown = axios.isAxiosError(moderate.error) ? moderate.error.response?.data?.message : undefined
  const error = typeof message === 'string' ? message : 'No se pudo actualizar el comentario.'
  const list = (comments.data ?? []).filter((comment) =>
    (filter === 'all' || comment.hidden === (filter === 'hidden')) &&
    [comment.content, comment.property.title, comment.author.name].join(' ').toLowerCase().includes(search.trim().toLowerCase()))

  if (!user) return <p role="status">Verificando sesión…</p>
  if (!isAdmin) return <p role="alert">Solo los administradores pueden gestionar comentarios.</p>

  return <PageContainer>
    <PageHeader title="Comentarios" description="Revisa los comentarios de las propiedades. Puedes ocultarlos con un motivo y restaurarlos." />
    <div className="mb-5 flex flex-wrap gap-3">
      <input aria-label="Buscar comentarios" value={search} onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por propiedad, autor o comentario" className="min-w-60 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" />
      <select aria-label="Estado del comentario" value={filter} onChange={(event) => setFilter(event.target.value)}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
        <option value="all">Todos</option><option value="visible">Visibles</option><option value="hidden">Ocultos</option>
      </select>
    </div>
    {comments.isPending && <p role="status">Cargando comentarios…</p>}
    {comments.isError && <p role="alert" className="text-red-700">No pudimos cargar los comentarios.
      <button type="button" onClick={() => void comments.refetch()} className="ml-2 underline">Reintentar</button>
    </p>}
    {moderate.isError && <p role="alert" className="mb-3 text-sm text-red-700">{error}</p>}
    {comments.isSuccess && !list.length && <p className="py-8 text-center text-slate-500">No hay comentarios para mostrar.</p>}
    <ul className="space-y-4">
      {list.map((comment) => <li key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h2 className="font-bold">{comment.property.title}</h2>
            <p className="text-sm text-slate-500">{comment.author.name} · {new Date(comment.createdAt).toLocaleDateString('es-CR')}</p>
          </div>
          <span className={comment.hidden ? 'text-sm font-semibold text-amber-700' : 'text-sm font-semibold text-green-700'}>{comment.hidden ? 'Oculto' : 'Visible'}</span>
        </div>
        <p className="my-4 whitespace-pre-wrap break-words text-sm">{comment.content}</p>
        {comment.hidden && <p className="mb-3 text-sm text-slate-500">Motivo: {comment.moderationNote}</p>}
        {selected?.id === comment.id ? <form className="space-y-2" onSubmit={(event) => {
          event.preventDefault()
          if (!note.trim() || moderate.isPending) return
          moderate.mutate({ id: comment.id, data: { hidden: true, note: note.trim() } }, { onSuccess: () => { setSelected(null); setNote('') } })
        }}>
          <label htmlFor="moderation-note" className="block text-sm font-semibold">Motivo para ocultarlo</label>
          <textarea id="moderation-note" required maxLength={500} rows={3} value={note}
            disabled={moderate.isPending} onChange={(event) => setNote(event.target.value)}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm" />
          <div className="flex gap-2">
            <button type="submit" disabled={moderate.isPending || !note.trim()} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Ocultar comentario</button>
            <button type="button" disabled={moderate.isPending} onClick={() => { setSelected(null); moderate.reset() }} className="rounded-lg border px-3 py-2 text-sm">Cancelar</button>
          </div>
        </form> : <button type="button" disabled={moderate.isPending} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold disabled:opacity-50"
          onClick={() => {
            moderate.reset()
            if (comment.hidden) moderate.mutate({ id: comment.id, data: { hidden: false } })
            else { setSelected(comment); setNote('') }
          }}>{moderate.isPending && moderate.variables?.id === comment.id ? 'Guardando…' : comment.hidden ? 'Restaurar comentario' : 'Ocultar comentario'}</button>}
      </li>)}
    </ul>
  </PageContainer>
}
