import ParticipantAvatar from '../../../Messages/Components/ParticipantAvatar';
import RoleBadge from '../../../Messages/Components/RoleBadge';
import { ROLE_LABELS } from '../../../Auth/utils/roles';
import type { AppRole } from '../../../Auth/types/roles';
import { useAdminUsers } from '../../../Users/hooks/useAdminUsers';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';

const SHOWN = 5;

function roleLabel(name: string): string {
  return ROLE_LABELS[name as AppRole] ?? name;
}

/** "Usuarios recientes": los últimos registrados, con sus roles y si la cuenta está suspendida. */
export default function RecentUsersSection() {
  const users = useAdminUsers();
  const recent = [...(users.data ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id).slice(0, SHOWN);

  return (
    <HomeSection title="Usuarios recientes" to="/dashboard/admin/users" linkLabel="Ver usuarios">
      {users.isPending ? (
        <SectionLoading />
      ) : users.isError ? (
        <SectionError message="No pudimos cargar los usuarios." onRetry={() => void users.refetch()} />
      ) : recent.length === 0 ? (
        <SectionEmpty title="Aún no hay usuarios" description="Los usuarios que se registren aparecerán aquí." />
      ) : (
        <ul className="-mx-2">
          {recent.map((user) => (
            <li key={user.id} className="flex items-center gap-3 px-2 py-2.5">
              <ParticipantAvatar initials={`${user.name.charAt(0)}${user.surname1.charAt(0)}`.toUpperCase()} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-primary">{user.name} {user.surname1}</p>
                <p className="truncate text-xs text-muted-ink">
                  Registrado el {new Date(user.createdAt).toLocaleDateString('es-CR')}
                  {!user.isActive && ' · cuenta suspendida'}
                </p>
              </div>
              <span className="flex shrink-0 flex-wrap justify-end gap-1">
                {user.roles.map((role) => (
                  <RoleBadge key={role.id}>{roleLabel(role.name)}</RoleBadge>
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  );
}
