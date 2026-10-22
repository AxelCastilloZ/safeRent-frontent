import i18n from '../../../i18n/instance';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { ImageOff, MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Property } from '../../Explore/interfaces/property.interface';
import { photoUrl, priceLabel } from '../../Explore/utils/property.utils';

interface PropertyThumbCardProps {
  property: Pick<Property, 'id' | 'title' | 'address' | 'cost' | 'typeOfCoin' | 'displayPrice' | 'files'>;
  /** Destino de la tarjeta; por defecto, la página pública de la propiedad. */
  to?: string;
  /** Etiqueta sobre la foto (por ejemplo "No disponible"). */
  badge?: string;
  /** Contenido extra bajo el precio (estado, inquilino, fecha…). */
  footer?: ReactNode;
  /** Sin página a la que ir: la tarjeta se muestra sin enlace y atenuada. */
  unavailable?: boolean;
  className?: string;
}

/** Tarjeta compacta con foto, título, ubicación y precio. */
export default function PropertyThumbCard({ property, to, badge, footer, unavailable = false, className = '' }: PropertyThumbCardProps) {
  useTranslation();
  const photo = photoUrl(property);

  const content = (
    <>
      <div className="relative aspect-[16/10] bg-slate-100">
        {photo ? (
          <img src={photo} alt="" loading="lazy" className={`size-full object-cover transition group-hover:scale-[1.02] ${unavailable ? 'grayscale' : ''}`} />
        ) : (
          <span className="grid size-full place-items-center text-slate-300">
            <ImageOff size={28} aria-hidden="true" />
          </span>
        )}
        {badge && <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-white">{badge}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="truncate text-sm font-bold text-primary">{property.title}</h3>
        <p className="flex items-center gap-1 text-xs text-muted-ink">
          <MapPin size={12} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{property.address}</span>
        </p>
        <p className="mt-1 text-sm font-extrabold text-primary">
          {priceLabel(property)} <span className="text-[11px] font-normal text-muted-ink">{i18n.t("common:perMonth")}</span>
        </p>
        {footer && <div className="mt-1 text-xs text-muted-ink">{footer}</div>}
      </div>
    </>
  );

  const base = 'flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white';
  if (unavailable) return <div className={`${base} opacity-80 ${className}`}>{content}</div>;
  return (
    <Link
      to={(to ?? `/property_detail/${property.id}`) as string}
      className={`group ${base} transition hover:border-secondary hover:shadow-sm ${className}`}
    >
      {content}
    </Link>
  );
}
