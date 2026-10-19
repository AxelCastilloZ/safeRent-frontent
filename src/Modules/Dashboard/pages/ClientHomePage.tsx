import { CalendarCheck, Heart, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useConversations, useUnreadMessagesCount } from '../../Messages/hooks/messageHooks';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import { useTenantProperties } from '../hooks/useTenantProperties';
import StatCard from '../Components/StatCard';
import { useDashboardUser } from '../hooks/useDashboardUser';
import { readSavedPropertyIds } from '../utils/savedProperties';

/** Inicio del panel del inquilino. Lo que no tiene backend se marca como pendiente, no se simula. */
export default function ClientHomePage() {
  const { firstName } = useDashboardUser();
  const properties = useTenantProperties();
  const conversations = useConversations();
  const unreadMessages = useUnreadMessagesCount();
  const [savedCount] = useState(() => readSavedPropertyIds().length);

  return (
    <PageContainer>
      <PageHeader title={firstName ? `Hola, ${firstName}` : 'Hola'} description="Este es el resumen de tu actividad en SafeRent." />

      <section aria-label="Resumen" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Propiedades reservadas" icon={CalendarCheck} value={properties.isError ? '—' : properties.data?.length} isLoading={properties.isPending} />
        <StatCard
          label="Mensajes sin leer"
          icon={MessageSquare}
          value={conversations.isError ? '—' : unreadMessages}
          isLoading={conversations.isPending}
          hint={conversations.data && `En ${conversations.data.length} ${conversations.data.length === 1 ? 'conversación' : 'conversaciones'}`}
        />
        <StatCard label="Propiedades guardadas" icon={Heart} value={savedCount} hint="Guardadas en este dispositivo" />
      </section>
    </PageContainer>
  );
}
