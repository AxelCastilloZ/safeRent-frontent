import { useState } from 'react';
import EmptyTable from '../../Components/EmptyTable';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import PendingNotice from '../../Components/PendingNotice';

const filters = [
  { value: 'all', label: 'Todos' },
  { value: 'clients', label: 'Inquilinos' },
  { value: 'owners', label: 'Propietarios' },
  { value: 'active', label: 'Activos' },
  { value: 'suspended', label: 'Suspendidos' },
] as const;

type UserFilter = (typeof filters)[number]['value'];

const columns = ['Nombre', 'Correo', 'Rol', 'Estado', 'Fecha de registro'];

/** Usuarios (admin): tabla y filtros listos; falta un endpoint seguro para listarlos. */
export default function AdminUsersPage() {
  const [filter, setFilter] = useState<UserFilter>('all');
  const current = filters.find((option) => option.value === filter);

  return (
    <PageContainer>
      <PageHeader title="Usuarios" description="Consulta las cuentas registradas en SafeRent." />
      <FilterTabs label="Filtrar usuarios" options={[...filters]} value={filter} onChange={setFilter} />
      <EmptyTable caption={`Usuarios: ${current?.label}`} columns={columns} emptyMessage="Aún no hay usuarios para mostrar." />
      <div className="mt-4 space-y-3">
        <PendingNotice>
          listado de usuarios — GET /users hoy es público y devuelve datos personales (cédula, teléfono, fecha de nacimiento), así que no se usa. Hace falta un endpoint restringido a administradores con solo los campos necesarios.
        </PendingNotice>
        <PendingNotice>suspender o reactivar cuentas — el backend no expone esa acción.</PendingNotice>
      </div>
    </PageContainer>
  );
}
