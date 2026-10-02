import { Link } from '@tanstack/react-router';
import { CalendarCheck } from 'lucide-react';
import { useState } from 'react';
import EmptyPanel from '../Components/EmptyPanel';
import FilterTabs from '../Components/FilterTabs';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import PendingNotice from '../Components/PendingNotice';

const filters = [
  { value: 'active', label: 'Activas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'past', label: 'Pasadas' },
] as const;

type ReservationFilter = (typeof filters)[number]['value'];

const emptyTitles: Record<ReservationFilter, string> = {
  active: 'No tienes reservaciones activas',
  pending: 'No tienes reservaciones pendientes',
  past: 'No tienes reservaciones pasadas',
};

/** Mis reservaciones (inquilino): filtros e interfaz listos; faltan las reservaciones en el backend. */
export default function ReservationsPage() {
  const [filter, setFilter] = useState<ReservationFilter>('active');

  return (
    <PageContainer>
      <PageHeader title="Mis reservaciones" description="Consulta el estado de tus reservaciones y las fechas de entrada y salida." />
      <FilterTabs label="Estado de la reservación" options={[...filters]} value={filter} onChange={setFilter} />
      <EmptyPanel
        icon={CalendarCheck}
        title={emptyTitles[filter]}
        description="Encuentra una propiedad y reserva para verla aquí."
        action={
          <Link to="/explorar" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark">
            Explorar propiedades
          </Link>
        }
      />
      <div className="mt-3">
        <PendingNotice>reservaciones (listar, ver detalle y cancelar) — no hay entidad ni endpoints en el backend.</PendingNotice>
      </div>
    </PageContainer>
  );
}
