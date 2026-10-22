import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { Search } from 'lucide-react'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../Auth/hooks/authHooks'
import { useAdminUsers } from '../../Users/hooks/useAdminUsers'
import { useStartDirectConversation } from '../hooks/messageHooks'
import { getApiErrorMessage } from '../utils/errors'
import { searchMessageableUsers, userRoleLabels } from '../utils/userSearch'
import ParticipantAvatar from './ParticipantAvatar'
import RoleBadge from './RoleBadge'

/**
 * Administrador: buscador para iniciar una conversación con cualquier cuenta activa (inquilino o propietario).
 * Busca entre los usuarios que ya trae el panel (GET /users); al elegir uno se crea o se retoma la conversación.
 */
export default function UserSearchPanel() {
  useTranslation();
  const { user: me } = useAuth()
  const users = useAdminUsers()
  const startDirect = useStartDirectConversation()
  const [query, setQuery] = useState('')
  const inputId = useId()

  const results = searchMessageableUsers(users.data, query, me?.id)
  const searching = query.trim().length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Enter abre la primera coincidencia, para poder escribir y seguir sin tocar el mouse.
    if (results[0] && !startDirect.isPending) startDirect.mutate(results[0].id)
  }

  return (
    <section aria-label={i18n.t("messages:usersearchpanel_nueva_conversacion")} className="border-b border-slate-200 px-5 py-3">
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor={inputId} className="sr-only">{i18n.t("messages:usersearchpanel_buscar_usuario_para_iniciar_una_conversacion")}</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              if (startDirect.isError) startDirect.reset()
            }}
            autoComplete="off"
            placeholder={i18n.t("messages:usersearchpanel_buscar_usuario_por_nombre_correo_o_rol")}
            className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus-visible:border-secondary focus-visible:ring-[3px] focus-visible:ring-secondary/30"
          />
        </div>
      </form>

      {users.isError && (
        <p role="alert" className="mt-2 text-xs text-red-700">{i18n.t("dashboard:recentuserssection_no_pudimos_cargar_los_usuarios")}{' '}
          <button type="button" onClick={() => void users.refetch()} className="font-semibold underline">{i18n.t("comments:propertycomments_reintentar")}</button>
        </p>
      )}
      {startDirect.isError && (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {getApiErrorMessage(startDirect.error, i18n.t("messages:usersearchpanel_no_pudimos_abrir_la_conversacion_intenta_nuevamente"))}
        </p>
      )}

      {searching && !users.isError && (
        users.isPending ? (
          <p role="status" className="mt-2 text-xs text-slate-500">{i18n.t("dashboard:adminuserspage_cargando_usuarios")}</p>
        ) : results.length === 0 ? (
          <p role="status" className="mt-2 text-xs text-slate-500">{i18n.t("messages:usersearchpanel_no_encontramos_usuarios_activos_con_esa_busqueda")}</p>
        ) : (
          <ul aria-label={i18n.t("messages:usersearchpanel_resultados_de_la_busqueda")} className="mt-2 max-h-64 space-y-1 overflow-y-auto">
            {results.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  disabled={startDirect.isPending}
                  onClick={() => startDirect.mutate(user.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-slate-100 disabled:opacity-60"
                >
                  <ParticipantAvatar initials={`${user.name.charAt(0)}${user.surname1.charAt(0)}`.toUpperCase()} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{`${user.name} ${user.surname1}`}</span>
                    <span className="block truncate text-xs text-slate-500">{user.email}</span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {userRoleLabels(user).map((label) => (
                        <RoleBadge key={label}>{label}</RoleBadge>
                      ))}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  )
}
