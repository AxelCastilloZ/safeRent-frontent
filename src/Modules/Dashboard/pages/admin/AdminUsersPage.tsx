import { messageFromError, message } from '../../../../i18n/messages';
import { useMessageState } from '../../../../i18n/useMessageState';
import { currentLocale } from '../../../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { useState } from 'react';
import { History, Mail, ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { ROLE_LABELS } from '../../../Auth/utils/roles';
import type { AppRole } from '../../../Auth/types/roles';
import { useStartDirectConversation } from '../../../Messages/hooks/messageHooks';
import ManageRolesModal from '../../../Users/Components/ManageRolesModal';
import UserActivityModal from '../../../Users/Components/UserActivityModal';
import { useAdminUsers, useSetUserActive } from '../../../Users/hooks/useAdminUsers';
import type { AdminUser } from '../../../Users/types/user';
import EmptyPanel from '../../Components/EmptyPanel';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import { useDashboardUser } from '../../hooks/useDashboardUser';
import { Users as UsersIcon } from 'lucide-react';

const filters = () => ([
  { value: 'all', label: i18n.t("comments:admincommentspage_todos") },
  { value: 'clients', label: i18n.t("dashboard:adminuserspage_inquilinos") },
  { value: 'owners', label: i18n.t("dashboard:adminuserspage_propietarios") },
  { value: 'active', label: i18n.t("dashboard:adminuserspage_activos") },
  { value: 'suspended', label: i18n.t("dashboard:adminuserspage_suspendidos") },
] as const);

type UserFilter = (ReturnType<typeof filters>)[number]['value'];

function hasRole(user: AdminUser, role: AppRole): boolean {
  return user.roles.some((r) => r.name === role);
}

function roleLabel(name: string): string {
  return ROLE_LABELS()[name as AppRole] ?? name;
}

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString(currentLocale(), { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return value;
  }
}

/** Usuarios (admin): lista real de cuentas, con gestión de roles, suspensión y eliminación. */
export default function AdminUsersPage() {
  useTranslation();
  const [filter, setFilter] = useState<UserFilter>('all');
  const [managingUser, setManagingUser] = useState<AdminUser | null>(null);
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [actionError, setActionError] = useMessageState('');

  const users = useAdminUsers();
  const setActive = useSetUserActive();
  const startDirect = useStartDirectConversation();
  const { userId: currentUserId } = useDashboardUser();

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
      setActionError(err instanceof Error ? messageFromError(err) : message("dashboard:adminuserspage_no_se_pudo_actualizar_la_cuenta"));
    }
  }

  /** Por qué no se puede escribir a esta cuenta (o undefined si sí se puede). */
  function messageBlockedReason(user: AdminUser): string | undefined {
    if (user.id === currentUserId) return i18n.t("dashboard:adminuserspage_no_puedes_escribirte_a_ti_mismo");
    if (hasRole(user, 'ADMIN')) return i18n.t("dashboard:adminuserspage_no_se_puede_escribir_a_otro_administrador");
    if (!user.isActive) return i18n.t("dashboard:adminuserspage_no_se_puede_escribir_a_una_cuenta_suspendida");
    return undefined;
  }

  async function sendMessage(user: AdminUser) {
    setActionError('');
    try {
      // Crea (o retoma) la conversación directa y abre el chat en /dashboard/admin/messages/:id.
      await startDirect.mutateAsync(user.id);
    } catch (err) {
      setActionError(messageFromError(err, message("dashboard:adminuserspage_no_se_pudo_abrir_la_conversacion")));
    }
  }

  return (
    <PageContainer>
      <PageHeader title={i18n.t("dashboard:adminhomepage_usuarios")} description={i18n.t("dashboard:adminuserspage_consulta_las_cuentas_registradas_en_saferent_y_gestiona_sus")} />
      <FilterTabs label={i18n.t("dashboard:adminuserspage_filtrar_usuarios")} options={[...filters()]} value={filter} onChange={setFilter} />

      {actionError && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      )}

      {users.isPending ? (
        <p role="status" className="py-12 text-center text-sm text-muted-ink">{i18n.t("dashboard:adminuserspage_cargando_usuarios")}</p>
      ) : users.isError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">{i18n.t("dashboard:recentuserssection_no_pudimos_cargar_los_usuarios")}{' '}
          <button type="button" onClick={() => void users.refetch()} className="font-semibold underline">{i18n.t("comments:propertycomments_reintentar")}</button>
        </div>
      ) : visible.length === 0 ? (
        <EmptyPanel icon={UsersIcon} title={i18n.t("dashboard:adminuserspage_no_hay_usuarios_en_este_filtro")} description={i18n.t("dashboard:adminuserspage_ajusta_el_filtro_para_ver_otras_cuentas")} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <caption className="sr-only">{i18n.t("dashboard:adminuserspage_usuarios")}{' '}{filters().find((f) => f.value === filter)?.label}</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-muted-ink">
              <tr>
                {[i18n.t("dashboard:adminuserspage_nombre"), i18n.t("dashboard:adminuserspage_correo"), i18n.t("dashboard:adminuserspage_rol"), i18n.t("dashboard:adminpropertiespage_estado"), i18n.t("dashboard:adminuserspage_fecha_de_registro"), i18n.t("dashboard:adminpropertiespage_acciones")].map((column) => (
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
                      {user.roles.length === 0 && <span className="text-xs text-slate-400">{i18n.t("dashboard:adminuserspage_sin_rol")}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? i18n.t("dashboard:adminuserspage_activo") : i18n.t("dashboard:adminuserspage_suspendido")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-ink">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title={messageBlockedReason(user) ?? i18n.t("dashboard:adminuserspage_enviar_mensaje")}
                        aria-label={i18n.t("dashboard:adminuserspage_enviar_mensaje_a", { v0: user.name })}
                        disabled={Boolean(messageBlockedReason(user)) || startDirect.isPending}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-primary disabled:opacity-40"
                        onClick={() => void sendMessage(user)}
                      >
                        <Mail size={17} />
                      </button>
                      <button
                        type="button"
                        title={i18n.t('reservations:userActivityButton')}
                        aria-label={i18n.t('reservations:userActivityButtonFor', { name: user.name })}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-primary"
                        onClick={() => setViewingUser(user)}
                      >
                        <History size={17} />
                      </button>
                      <button
                        type="button"
                        title={i18n.t("dashboard:adminuserspage_gestionar_roles")}
                        aria-label={i18n.t("dashboard:adminuserspage_gestionar_roles_de", { v0: user.name })}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-primary"
                        onClick={() => setManagingUser(user)}
                      >
                        <ShieldCheck size={17} />
                      </button>
                      <button
                        type="button"
                        title={user.isActive ? i18n.t("dashboard:adminuserspage_desactivar_usuario") : i18n.t("dashboard:adminuserspage_volver_a_activar_usuario")}
                        aria-label={user.isActive ? i18n.t("dashboard:adminuserspage_desactivar_a", { v0: user.name }) : i18n.t("dashboard:adminuserspage_volver_a_activar_a", { v0: user.name })}
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
      {viewingUser && <UserActivityModal user={viewingUser} onClose={() => setViewingUser(null)} />}
    </PageContainer>
  );
}
