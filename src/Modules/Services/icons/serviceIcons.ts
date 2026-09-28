import {
  Droplets,
  Wifi,
  Zap,
  PlugZap,
  Car,
  WashingMachine,
  AirVent,
  Tv,
  CookingPot,
  Refrigerator,
  Flame,
  ShowerHead,
  PawPrint,
  Dumbbell,
  Waves,
  Trees,
  ShieldCheck,
  Accessibility,
  Coffee,
  Sun,
  BedDouble,
  Bike,
  Package,
  type LucideIcon,
} from 'lucide-react'

export const serviceIcons: { name: string; label: string; Icon: LucideIcon }[] =
  [
    { name: 'droplets', label: 'Agua', Icon: Droplets },
    { name: 'wifi', label: 'Internet', Icon: Wifi },
    { name: 'zap', label: 'Electricidad', Icon: Zap },
    { name: 'plug-zap', label: 'Carga eléctrica', Icon: PlugZap },
    { name: 'car', label: 'Estacionamiento', Icon: Car },
    { name: 'washing-machine', label: 'Lavandería', Icon: WashingMachine },
    { name: 'air-vent', label: 'Aire acondicionado', Icon: AirVent },
    { name: 'tv', label: 'Televisión', Icon: Tv },
    { name: 'cooking-pot', label: 'Cocina', Icon: CookingPot },
    { name: 'refrigerator', label: 'Refrigerador', Icon: Refrigerator },
    { name: 'flame', label: 'Gas', Icon: Flame },
    { name: 'shower-head', label: 'Agua caliente', Icon: ShowerHead },
    { name: 'paw-print', label: 'Mascotas', Icon: PawPrint },
    { name: 'dumbbell', label: 'Gimnasio', Icon: Dumbbell },
    { name: 'waves', label: 'Piscina', Icon: Waves },
    { name: 'trees', label: 'Jardín', Icon: Trees },
    { name: 'shield-check', label: 'Seguridad', Icon: ShieldCheck },
    { name: 'accessibility', label: 'Accesibilidad', Icon: Accessibility },
    { name: 'coffee', label: 'Cafetería', Icon: Coffee },
    { name: 'sun', label: 'Terraza', Icon: Sun },
    { name: 'bed-double', label: 'Amueblado', Icon: BedDouble },
    { name: 'bike', label: 'Bicicletas', Icon: Bike },
  ]

export function resolveServiceIcon(name?: string | null): LucideIcon {
  const aliases: Record<string, string> = {
    pool: 'waves',
    droplet: 'droplets',
    water: 'droplets',
    internet: 'wifi',
    cargador: 'plug-zap',
  }
  const normalized = name?.trim().toLowerCase() || ''
  return (
    serviceIcons.find(
      (icon) => icon.name === (aliases[normalized] || normalized),
    )?.Icon || Package
  )
}
