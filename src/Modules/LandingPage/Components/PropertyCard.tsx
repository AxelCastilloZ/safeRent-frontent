import { BedDouble, Building2, MapPin, Users } from 'lucide-react'
import { useState } from 'react'
import ServiceIcon from '../../Services/components/ServiceIcon'
import { photoUrl, priceLabel } from '../../Explore/utils/property.utils'
import type { Property } from '../../Explore/interfaces/property.interface'

type PropertyCardProps = { property: Property }

export default function PropertyCard({ property }: PropertyCardProps) {
  const image = photoUrl(property)
  const [failedImage, setFailedImage] = useState<string>()
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {image && failedImage !== image ? <img
          src={image}
          alt={property.title}
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy" onError={() => setFailedImage(image)}
        /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400"><Building2 size={40} aria-hidden="true" /><span className="text-sm">Sin fotografía</span></div>}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-secondary-dark shadow-sm backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-secondary" />
          Publicada
        </span>

        <p className="absolute bottom-3 right-3 rounded-xl bg-white/95 px-3 py-1.5 text-right shadow-sm backdrop-blur-sm">
          <span className="text-base font-extrabold text-primary">{priceLabel(property)}</span>
          <span className="block text-[10px] font-semibold uppercase leading-tight tracking-wide text-neutral/60">/{property.typeOfCoin || 'CRC'} mes</span>
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-primary">{property.title}</h3>
        <p className="mt-1 inline-flex items-center gap-1 text-sm text-neutral/70">
          <MapPin size={15} className="shrink-0 text-neutral/50" aria-hidden="true" />
          {property.address}
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
          <BedDouble size={19} className="shrink-0 text-primary" aria-hidden="true" />
          <span className="text-sm text-neutral/65">{property.rooms} habitaciones</span>
          <Users size={19} className="shrink-0 text-primary" aria-hidden="true" />
          <span className="text-sm text-neutral/65">{property.guest} huéspedes</span>
        </div>

        <div className="mt-4 mb-4 flex flex-wrap items-center gap-2">
          {property.services?.map((service) => (
            <span key={service.id} title={service.name} aria-label={service.name}
              className="grid size-8 place-items-center rounded-lg bg-slate-100 text-neutral/70 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <ServiceIcon name={service.icono} size={16} />
            </span>
          ))}
        </div>

        <a href={`/property_detail/${property.id}`}
          className="mt-auto inline-flex w-full items-center justify-center rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-secondary-dark transition-colors hover:border-secondary hover:bg-secondary/5"
        >
          Ver detalles
        </a>
      </div>
    </article>
  )
}
