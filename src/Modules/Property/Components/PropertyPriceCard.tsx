import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Property } from '../../Explore/interfaces/property.interface';
import { priceLabel } from '../../Explore/utils/property.utils';
import PriceDetails from '../../Explore/PriceDetails';
import ReservationLabel from '../../Reservations/Components/ReservationLabel';

export default function PropertyPriceCard({ property, ownerName, ownerId, children }: { property: Property; ownerName: string; ownerId?: number; children: ReactNode }) {
  const { t } = useTranslation();
  return <aside aria-label={t('property:publicpropertypage_precio_y_contacto')} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
    <p><span className="text-3xl font-extrabold">{priceLabel(property)}</span><span className="text-sm text-neutral/70">{' '}{t('common:perMonth')}</span></p>
    <ReservationLabel property={property} />
    <PriceDetails price={property.displayPrice} />
    <div className="my-6 border-y border-slate-100 py-4"><p className="text-xs uppercase tracking-wide text-neutral/60">{t('property:publicpropertypage_publicado_por')}</p>{ownerId === undefined ? <p className="mt-1 font-bold">{ownerName}</p> : <Link to="/owner_properties/$ownerId" params={{ ownerId: String(ownerId) }} className="mt-1 inline-block font-bold text-primary underline decoration-secondary/40 underline-offset-4 transition hover:text-secondary hover:decoration-secondary">{ownerName}</Link>}
      {ownerId !== undefined && <p className="mt-0.5 text-xs text-neutral/60">{t('property:viewOwnerProperties')}</p>}</div>
    {children}
  </aside>;
}
