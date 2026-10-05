import { useState } from 'react';
import { ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { ROLE_LABELS } from '../../../Auth/utils/roles';
import type { AppRole } from '../../../Auth/types/roles';
import ManageRolesModal from '../../../Users/Components/ManageRolesModal';
import { useAdminUsers, useSetUserActive } from '../../../Users/hooks/useAdminUsers';
import type { AdminUser } from '../../../Users/types/user';
import EmptyPanel from '../../Components/EmptyPanel';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import { Users as UsersIcon } from 'lucide-react';

const filters = [
  { value: 'all', label: 'Todos' },
  { value: 'clients', label: 'Inquilinos' },
  { value: 'owners', label: 'Propietarios' },
  { value: 'active', label: 'Activos' },
  { value: 'suspended', label: 'Suspendidos' },
] as const;

type UserFilter = (typeof filters)[number]['value'];

function hasRole(user: AdminUser, role: AppRole): boolean {
  return user.roles.some((r) => r.name === role);
}

function roleLabel(name: string): string {
  return ROLE_LABELS[name as AppRole] ?? name;
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return value;
  }
}

/** Usuarios (admin): lista real de cuentas, con gestión de roles, suspensión y eliminación. */
export default function AdminUsersPage() {
  const [filter, setFilter] = useState<UserFilter>('all');
  const [managingUser, setManagingUser] = useState<AdminUser | null>(null);
  const [actionError, setActionError] = useState('');

  const users = useAdminUsers();
  const setActive = useSetUserActive();

  const visible = (users.data ?? []).filter((user) => {
    switch (filter) {
      case 'clients':
        return hasRole(user, 'CLIENT');
      case 'owners':
        return hasRole(user, 'OWNER');
      case 'active':
        return user.isActive;
      case 'suspended':
        return !user.isActive;
      default:
        return true;
    }
  });

  async function toggleActive(user: AdminUser) {
    setActionError('');
    try {
      await setActive.mutateAsync({ id: user.id, isActive: !user.isActive });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'No se pudo actualizar la cuenta.');
    }
  }

  return (
    <PageContainer>
      <PageHeader title="Usuarios" description="Consulta las cuentas registradas en SafeRent y gestiona sus roles y acceso." />
      <FilterTabs label="Filtrar usuarios" options={[...filters]} value={filter} onChange={setFilter} />

      {actionError && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      )}

      {users.isPending ? (
        <p role="status" className="py-12 text-center text-sm text-muted-ink">
          Cargando usuarios…
        </p>
      ) : users.isError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          No pudimos cargar los usuarios.{' '}
          <button type="button" onClick={() => void users.refetch()} className="font-semibold underline">
            Reintentar
          </button>
        </div>
      ) : visible.length === 0 ? (
        <EmptyPanel icon={UsersIcon} title="No hay usuarios en este filtro" description="Ajusta el filtro para ver otras cuentas." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">Usuarios: {filters.find((f) => f.value === filter)?.label}</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-muted-ink">
              <tr>
                {['Nombre', 'Correo', 'Rol', 'Estado', 'Fecha de registro', 'Acciones'].map((column) => (
                  <th key={column} scope="col" className="px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-semibold text-primary">
                    {user.name} {user.surname1} {user.surname2 ?? ''}
                  </td>
                  <td className="px-4 py-3 text-muted-ink">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <span key={role.id} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                          {roleLabel(role.name)}
                        </span>
                      ))}
                      {user.roles.length === 0 && <span className="text-xs text-slate-400">Sin rol</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? 'Activo' : 'Suspendido'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-ink">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Gestionar roles"
                        aria-label={`Gestionar roles de ${user.name}`}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-primary"
                        onClick={() => setManagingUser(user)}
                      >
                        <ShieldCheck size={17} />
                      </button>
                      <button
                        type="button"
                        title={user.isActive ? 'Desactivar usuario' : 'Volver a activar usuario'}
                        aria-label={user.isActive ? `Desactivar a ${user.name}` : `Volver a activar a ${user.name}`}
                        disabled={setActive.isPending}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-primary disabled:opacity-50"
                        onClick={() => void toggleActive(user)}
                      >
                        {user.isActive ? <UserX size={17} /> : <UserCheck size={17} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {managingUser && <ManageRolesModal user={managingUser} onClose={() => setManagingUser(null)} />}
    </PageContainer>
  );
}
