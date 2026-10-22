import { Link } from '@tanstack/react-router';
import { ImageOff, MessageCircle } from 'lucide-react';
import PriceDetails from '../../../Explore/PriceDetails';
import { photoUrl, priceLabel } from '../../../Explore/utils/property.utils';
import { useStartConversation } from '../../../Messages/hooks/messageHooks';
import { useDashboardUser } from '../../hooks/useDashboardUser';
import { useTenantProperties } from '../../hooks/useTenantProperties';
import HomeSection from '../HomeSection';
import { SectionEmpty, SectionError, SectionLoading } from './SectionStates';

/** "Tu propiedad reservada": la reservación más reciente del inquilino (GET /properties/me/reserved). */
export default function ReservedPropertySection() {
  const { userId } = useDashboardUser();
  const reserved = useTenantProperties();
  const startConversation = useStartConversation();
  const [property, ...others] = reserved.data ?? [];
  const photo = property ? photoUrl(property) : undefined;

  return (
    <HomeSection title="Tu propiedad reservada" to="/dashboard/reservations" linkLabel="Mis reservaciones">
      {reserved.isPending ? (
        <SectionLoading shape="media" />
      ) : reserved.isError ? (
        <SectionError message="No pudimos cargar tu reservación." onRetry={() => void reserved.refetch()} />
      ) : !property ? (
        <SectionEmpty
          title="Aún no tienes una propiedad reservada"
          description="Cuando un propietario confirme tu reserva, la verás aquí."
          actionLabel="Explorar propiedades"
          actionTo="/explorar"
        />
      ) : (
        <div className="flex gap-4">
          <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:size-28">
            {photo ? <img src={photo} alt="" className="size-full object-cover" /> : <span className="grid size-full place-items-center text-slate-300"><ImageOff size={26} aria-hidden="true" /></span>}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-bold text-primary">{property.title}</h3>
            <p className="truncate text-xs text-muted-ink">{property.address}</p>
            <p className="mt-1 text-sm font-extrabold text-primary">
              {priceLabel(property)} <span className="text-[11px] font-normal text-muted-ink">/ mes</span>
            </p>
            <PriceDetails price={property.displayPrice} />
            <p className="mt-1 text-xs text-muted-ink">
              Propietario: {property.owner.name}
              {property.reservedAt && ` · Reservada el ${new Date(property.reservedAt).toLocaleDateString('es-CR')}`}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {property.status === 'ACTIVE' && (
                <Link to="/property_detail/$propertyId" params={{ propertyId: String(property.id) }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-secondary">
                  Ver detalles
                </Link>
              )}
              {userId !== undefined && (
                <button
                  type="button"
                  onClick={() => startConversation.mutate({ participantIds: [userId, property.owner.id], propertyId: property.id })}
                  disabled={startConversation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-secondary-dark disabled:opacity-60"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  {startConversation.isPending ? 'Abriendo…' : 'Escribir al propietario'}
                </button>
              )}
            </div>
            {startConversation.isError && <p role="alert" className="mt-2 text-xs text-red-700">No pudimos abrir el chat. Intenta de nuevo.</p>}
            {others.length > 0 && <p className="mt-2 text-xs text-muted-ink">y {others.length} {others.length === 1 ? 'reservación más' : 'reservaciones más'}</p>}
          </div>
        </div>
      )}
    </HomeSection>
  );
}
