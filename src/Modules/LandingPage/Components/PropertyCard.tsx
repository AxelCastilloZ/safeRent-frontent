import { BadgeCheck, Droplets, MapPin, ShieldCheck, Star, Wifi, Zap } from 'lucide-react'
import type { Property } from '../types/property'

type PropertyCardProps = { property: Property }

const serviceIcons = [Droplets, Zap, Wifi]

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/70">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={property.image}
          alt={property.title}
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

        {(property.available || property.verified) && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-secondary-dark shadow-sm backdrop-blur-sm">
            {property.verified ? <BadgeCheck size={14} aria-hidden="true" /> : <span className="size-1.5 rounded-full bg-secondary" />}
            {property.verified ? 'Verificado' : 'Disponible'}
          </span>
        )}

        <p className="absolute bottom-3 right-3 rounded-xl bg-white/95 px-3 py-1.5 text-right shadow-sm backdrop-blur-sm">
          <span className="text-base font-extrabold text-primary">${property.price}</span>
          <span className="block text-[10px] font-semibold uppercase leading-tight tracking-wide text-neutral/60">/{property.currency} mes</span>
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-primary">{property.title}</h3>
        <p className="mt-1 inline-flex items-center gap-1 text-sm text-neutral/70">
          <MapPin size={15} className="shrink-0 text-neutral/50" aria-hidden="true" />
          {property.location}
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5">
          <ShieldCheck size={19} className="shrink-0 text-primary" aria-hidden="true" />
          <div className="flex items-center gap-1">
            <Star size={15} className="fill-tertiary text-tertiary" aria-hidden="true" />
            <span className="font-bold text-primary">{property.rating.toFixed(1)}</span>
            <span className="text-sm text-neutral/65">({property.reviews} reseñas)</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {serviceIcons.map((Icon, index) =>
            property.services[index] ? (
              <span
                key={property.services[index]}
                title={property.services[index]}
                className="grid size-8 place-items-center rounded-lg bg-slate-100 text-neutral/70 transition-colors group-hover:bg-primary/10 group-hover:text-primary"
              >
                <Icon size={16} aria-hidden="true" />
              </span>
            ) : null,
          )}
        </div>

        <button
          type="button"
          className="mt-auto inline-flex w-full items-center justify-center rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-secondary-dark transition-colors hover:border-secondary hover:bg-secondary/5"
        >
          Ver detalles
        </button>
      </div>
    </article>
  )
}
