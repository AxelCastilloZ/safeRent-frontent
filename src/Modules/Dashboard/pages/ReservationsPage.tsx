import { Link } from '@tanstack/react-router';
import { CalendarCheck } from 'lucide-react';
import EmptyPanel from '../Components/EmptyPanel';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import { useTenantProperties } from '../hooks/useTenantProperties';
import { priceLabel } from '../../Explore/utils/property.utils';

export default function ReservationsPage() {
  const properties = useTenantProperties();
  return (
    <PageContainer>
      <PageHeader title="Mis reservaciones" description="Consulta las propiedades reservadas a tu nombre." />
      {properties.isPending && <p role="status">Cargando tus propiedades…</p>}
      {properties.isError && <div role="alert" className="rounded-xl border border-red-200 bg-white p-5 text-red-700">
        No se pudieron cargar tus propiedades.
        <button type="button" onClick={() => void properties.refetch()} className="ml-3 font-semibold underline">Reintentar</button>
      </div>}
      {properties.isSuccess && (properties.data.length ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.data.map((property) => (
            <li key={property.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-primary">{property.title}</h2>
              <p className="text-sm text-muted-ink">{property.address}</p>
              <p className="font-semibold">{priceLabel(property)} / mes</p>
              <p className="text-sm">Propietario: {property.owner.name}</p>
              {property.reservedAt && <p className="text-sm text-muted-ink">Reservada el {new Date(property.reservedAt).toLocaleDateString('es-CR')}</p>}
              {property.status === 'ACTIVE' && <a href={`/property_detail/${property.id}`} className="mt-auto font-bold text-secondary hover:underline">Ver detalles</a>}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyPanel icon={CalendarCheck} title="Aún no tienes propiedades reservadas" description="Cuando el propietario confirme tu reserva, aparecerá aquí." action={
          <Link to="/explorar" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary-dark">Explorar propiedades</Link>
        } />
      ))}
    </PageContainer>
  );
}
