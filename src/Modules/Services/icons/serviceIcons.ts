import i18n from '../../../i18n/instance';
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

export const serviceIcons: () => { name: string; label: string; Icon: LucideIcon }[] =
  () => ([
    { name: 'droplets', label: i18n.t("services:serviceicons_agua"), Icon: Droplets },
    { name: 'wifi', label: i18n.t("services:serviceicons_internet"), Icon: Wifi },
    { name: 'zap', label: i18n.t("services:serviceicons_electricidad"), Icon: Zap },
    { name: 'plug-zap', label: i18n.t("services:serviceicons_carga_electrica"), Icon: PlugZap },
    { name: 'car', label: i18n.t("services:serviceicons_estacionamiento"), Icon: Car },
    { name: 'washing-machine', label: i18n.t("services:serviceicons_lavanderia"), Icon: WashingMachine },
    { name: 'air-vent', label: i18n.t("services:serviceicons_aire_acondicionado"), Icon: AirVent },
    { name: 'tv', label: i18n.t("services:serviceicons_television"), Icon: Tv },
    { name: 'cooking-pot', label: i18n.t("services:serviceicons_cocina"), Icon: CookingPot },
    { name: 'refrigerator', label: i18n.t("services:serviceicons_refrigerador"), Icon: Refrigerator },
    { name: 'flame', label: i18n.t("services:serviceicons_gas"), Icon: Flame },
    { name: 'shower-head', label: i18n.t("services:serviceicons_agua_caliente"), Icon: ShowerHead },
    { name: 'paw-print', label: i18n.t("services:serviceicons_mascotas"), Icon: PawPrint },
    { name: 'dumbbell', label: i18n.t("services:serviceicons_gimnasio"), Icon: Dumbbell },
    { name: 'waves', label: i18n.t("services:serviceicons_piscina"), Icon: Waves },
    { name: 'trees', label: i18n.t("services:serviceicons_jardin"), Icon: Trees },
    { name: 'shield-check', label: i18n.t("about:valuessection_seguridad"), Icon: ShieldCheck },
    { name: 'accessibility', label: i18n.t("services:serviceicons_accesibilidad"), Icon: Accessibility },
    { name: 'coffee', label: i18n.t("services:serviceicons_cafeteria"), Icon: Coffee },
    { name: 'sun', label: i18n.t("services:serviceicons_terraza"), Icon: Sun },
    { name: 'bed-double', label: i18n.t("services:serviceicons_amueblado"), Icon: BedDouble },
    { name: 'bike', label: i18n.t("services:serviceicons_bicicletas"), Icon: Bike },
  ])

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
    serviceIcons().find(
      (icon) => icon.name === (aliases[normalized] || normalized),
    )?.Icon || Package
  )
}
