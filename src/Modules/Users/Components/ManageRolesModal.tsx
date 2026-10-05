import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LoaderCircle, Plus, X } from 'lucide-react'
import { ROLE_LABELS } from '../../Auth/utils/roles'
import type { AppRole } from '../../Auth/types/roles'
import { useAddUserRole, useRemoveUserRole, useRoles } from '../hooks/useAdminUsers'
import type { AdminUser } from '../types/user'

function roleLabel(name: string): string {
  return ROLE_LABELS[name as AppRole] ?? name
}

interface ManageRolesModalProps {
  user: AdminUser
  onClose: () => void
}

/** Agrega o quita roles de un usuario (p. ej. convertir a un inquilino también en propietario). */
export default function ManageRolesModal({ user, onClose }: ManageRolesModalProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const roles = useRoles()
  const addRole = useAddUserRole()
  const removeRole = useRemoveUserRole()
  const [error, setError] = useState('')

  useEffect(() => {
    const element = dialog.current!
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = overflow
    }
  }, [])

  const currentRoleIds = new Set(user.roles.map((role) => role.id))
  const busy = addRole.isPending || removeRole.isPending

  async function toggleRole(roleId: number, has: boolean) {
    setError('')
    try {
      if (has) {
        await removeRole.mutateAsync({ id: user.id, roleId })
      } else {
        await addRole.mutateAsync({ id: user.id, roleId })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el rol.')
    }
  }

  return createPortal(
    <dialog
      ref={dialog}
      className="m-auto w-[min(420px,90vw)] rounded-2xl border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-slate-900/40"
      aria-labelledby="manage-roles-title"
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onClose()
      }}
    >
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="manage-roles-title" className="text-base font-bold text-primary">
              Roles de {user.name} {user.surname1}
            </h2>
            <p className="mt-1 text-sm text-muted-ink">Agrega o quita roles de esta cuenta.</p>
          </div>
          <button type="button" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Cerrar" onClick={onClose} disabled={busy}>
            <X size={18} />
          </button>
        </div>

        {roles.isPending ? (
          <p className="py-6 text-center text-sm text-muted-ink">Cargando roles…</p>
        ) : roles.isError ? (
          <p role="alert" className="py-6 text-center text-sm text-red-700">No se pudieron cargar los roles.</p>
        ) : (
          <ul className="space-y-2">
            {(roles.data ?? []).map((role) => {
              const has = currentRoleIds.has(role.id)
              const lastRole = has && user.roles.length <= 1
              return (
                <li key={role.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-semibold text-primary">{roleLabel(role.name)}</p>
                    <p className="text-xs text-slate-400">{role.description}</p>
                  </div>
                  <button
                    type="button"
                    disabled={busy || (has && lastRole)}
                    title={has && lastRole ? 'El usuario debe conservar al menos un rol.' : undefined}
                    onClick={() => void toggleRole(role.id, has)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
                      has ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
                    }`}
                  >
                    {has ? <X size={14} /> : <Plus size={14} />}
                    {has ? 'Quitar' : 'Agregar'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50" onClick={onClose} disabled={busy}>
            {busy && <LoaderCircle size={14} className="mr-1.5 inline animate-spin" />}
            Cerrar
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  )
}
