import { Link } from '@tanstack/react-router';
import { useAdminReviewQueue } from '../../hooks/useAdminReviewQueue';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';

const SHOWN = 5;

/** "Pendientes de revisión": las 5 que llevan más tiempo esperando, para atenderlas en orden. */
export default function PendingReviewSection() {
  const review = useAdminReviewQueue();
  const next = review.data?.queue.slice(0, SHOWN) ?? [];

  return (
    <HomeSection title="Pendientes de revisión" to="/dashboard/admin/properties" linkLabel="Ver propiedades">
      {review.isPending ? (
        <SectionLoading />
      ) : review.isError ? (
        <SectionError message="No pudimos cargar la cola de revisión." onRetry={() => void review.refetch()} />
      ) : next.length === 0 ? (
        <SectionEmpty title="No hay propiedades por revisar" description="Cuando un propietario envíe una propiedad, aparecerá aquí." />
      ) : (
        <>
          <ul className="-mx-2">
            {next.map((property) => (
              <li key={property.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-primary">{property.title}</p>
                  <p className="truncate text-xs text-muted-ink">
                    {property.owner.name} {property.owner.surname1} · creada el {new Date(property.createdAt).toLocaleDateString('es-CR')}
                  </p>
                </div>
                <Link to="/dashboard/admin/properties" className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-secondary">
                  Revisar
                </Link>
              </li>
            ))}
          </ul>
          {(review.data?.total ?? 0) > next.length && (
            <p className="mt-2 text-xs text-muted-ink">y {(review.data?.total ?? 0) - next.length} más en espera</p>
          )}
        </>
      )}
    </HomeSection>
  );
}
