import { Building2, House, Sofa, BedDouble, type LucideIcon } from 'lucide-react'

// Los tipos de propiedad vienen del backend sin icono, así que se asocia uno por nombre (sin tildes ni mayúsculas).
const ICONS: Record<string, LucideIcon> = {
  casa: House,
  apartamento: Building2,
  habitacion: BedDouble,
  estudio: Sofa,
}

const normalize = (name: string) => name.normalize('NFD').replace(new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, 'g'), '').trim().toLowerCase()

/** Icono para un tipo de propiedad; uno genérico si el nombre no está en la lista. */
export function propertyTypeIcon(name: string): LucideIcon {
  return ICONS[normalize(name)] ?? Building2
}
