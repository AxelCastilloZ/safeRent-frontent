import { Link } from '@tanstack/react-router';
import { CalendarCheck, CalendarClock, Heart, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useConversations } from '../../Messages/hooks/messageHooks';
import EmptyPanel from '../Components/EmptyPanel';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import PendingNotice from '../Components/PendingNotice';
import StatCard from '../Components/StatCard';
import { useDashboardUser } from '../hooks/useDashboardUser';
import { readSavedPropertyIds } from '../utils/savedProperties';

/** Inicio del panel del inquilino. Lo que no tiene backend se marca como pendiente, no se simula. */
export default function ClientHomePage() {
  const { firstName } = useDashboardUser();
  const conversations = useConversations();
  const [savedCount] = useState(() => readSavedPropertyIds().length);

  return (
    <PageContainer>
      <PageHeader title={firstName ? `Hola, ${firstName}` : 'Hola'} description="Este es el resumen de tu actividad en SafeRent." />

      <section aria-label="Resumen" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Reservaciones activas" icon={CalendarCheck} />
        <StatCard label="Reservaciones pendientes" icon={CalendarClock} />
        <StatCard
          label="Conversaciones"
          icon={MessageSquare}
          value={conversations.isError ? '—' : conversations.data?.length}
          isLoading={conversations.isPending}
          hint="Mensajes sin leer: pendiente de integrar"
        />
        <StatCard label="Propiedades guardadas" icon={Heart} value={savedCount} hint="Guardadas en este dispositivo" />
      </section>

      <section aria-labelledby="next-reservation" className="mt-8">
        <h2 id="next-reservation" className="mb-3 text-lg font-bold">
          Próxima reservación
        </h2>
        <EmptyPanel
          icon={CalendarCheck}
          title="Aún no tienes reservaciones"
          description="Cuando reserves una propiedad, aquí verás las fechas, el estado y las acciones disponibles."
          action={
            <Link to="/explorar" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark">
              Explorar propiedades
            </Link>
          }
        />
        <div className="mt-3">
          <PendingNotice>las reservaciones todavía no existen en el backend (sin entidad ni endpoints).</PendingNotice>
        </div>
      </section>
    </PageContainer>
  );
}
