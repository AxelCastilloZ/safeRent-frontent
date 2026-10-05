import axios from 'axios'
import { useState } from 'react'
import { useAuth } from '../../Auth/hooks/authHooks'
import { useCreatePropertyComment, usePropertyComments } from '../hooks/usePropertyComments'

export default function PropertyComments({ propertyId, tenantId }: { propertyId: number; tenantId?: number | null }) {
  const { user } = useAuth()
  const comments = usePropertyComments(propertyId)
  const create = useCreatePropertyComment(propertyId)
  const [content, setContent] = useState('')
  const alreadyCommented = comments.data?.some((comment) => comment.author.id === user?.id)
  const canComment = user?.id === tenantId && Boolean(user) && !alreadyCommented
  const message: unknown = axios.isAxiosError(create.error) ? create.error.response?.data?.message : undefined
  const error = typeof message === 'string' ? message : 'No se pudo publicar el comentario. Intenta nuevamente.'

  return <section className="mt-8 border-t border-slate-200 pt-6">
    <h2 className="text-xl font-bold">Comentarios de inquilinos</h2>
    {comments.isPending && <p role="status" className="mt-3 text-sm text-neutral/70">Cargando comentarios…</p>}
    {comments.isError && <div role="alert" className="mt-3 text-sm text-red-700">
      No se pudieron cargar los comentarios.
      <button type="button" onClick={() => void comments.refetch()} className="ml-2 font-semibold underline">Reintentar</button>
    </div>}
    {comments.isSuccess && <>
      {!comments.data.length && <p className="mt-3 text-sm text-neutral/70">Todavía no hay comentarios.</p>}
      <ul className="mt-4 space-y-4">
        {comments.data.map((comment) => <li key={comment.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">{comment.author.name}</span>
            <time dateTime={comment.createdAt} className="text-xs text-neutral/60">{new Date(comment.createdAt).toLocaleDateString('es-CR')}</time>
          </div>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-neutral">{comment.content}</p>
        </li>)}
      </ul>
      {canComment && <form className="mt-5 space-y-3" onSubmit={(event) => {
        event.preventDefault()
        if (!content.trim() || create.isPending) return
        create.mutate(content.trim(), { onSuccess: () => setContent('') })
      }}>
        <label htmlFor="property-comment" className="block text-sm font-semibold">Tu comentario sobre esta propiedad</label>
        <textarea id="property-comment" value={content} onChange={(event) => setContent(event.target.value)}
          required maxLength={1000} rows={4} disabled={create.isPending}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm focus:border-secondary focus:outline-none"
          placeholder="Cuéntanos tu experiencia con la propiedad." />
        {create.isError && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={create.isPending || !content.trim()}
          className="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-secondary-dark disabled:opacity-50">
          {create.isPending ? 'Publicando…' : 'Publicar comentario'}
        </button>
      </form>}
      {alreadyCommented && <p role="status" className="mt-3 text-sm text-secondary-dark">Ya publicaste tu comentario sobre esta propiedad.</p>}
    </>}
  </section>
}
