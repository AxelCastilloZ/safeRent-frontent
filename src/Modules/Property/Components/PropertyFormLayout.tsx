import { catalogText } from '../../../i18n/catalog';
import { currentLocale } from '../../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, BedDouble, Building2, CheckCircle2, ChevronRight, Circle, MapPin, Save, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import Stepper from './Stepper'
import { PROPERTY_STEPS } from '../constants/propertySteps'
import ServiceIcon from '../../Services/components/ServiceIcon'
import type { Service } from '../types/property'
import './property-form.css'

export interface PropertyPreview {
  title: string
  cost: number
  currency: string
  type?: string
  rooms: number
  guests: number
  description: string
  services: Service[]
  address?: string
  located?: boolean
  photos: string[]
}

export function FormSection({ icon: Icon, title, description, aside, children }: {
  icon: LucideIcon; title: string; description: string; aside?: ReactNode; children: ReactNode
}) {
  useTranslation();
  return <section className="property-section">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-6">
      <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-100"><Icon size={20} aria-hidden /></span>
        <div><h2 className="text-base font-semibold text-slate-900">{title}</h2><p className="mt-0.5 text-sm text-slate-500">{description}</p></div>
      </div>{aside}
    </header><div className="space-y-5 p-4 sm:p-6">{children}</div>
  </section>
}

function Summary({ data }: { data: PropertyPreview }) {
  useTranslation();
  const items = [
    { label: i18n.t("property:propertyformlayout_titulo"), done: !!data.title.trim() },
    { label: i18n.t("explore:explorepage_precio_mensual"), done: data.cost > 0 },
    { label: i18n.t("property:propertyformlayout_tipo_de_propiedad"), done: !!data.type },
    { label: i18n.t("property:propertyformlayout_descripcion"), done: !!data.description.trim() },
    { label: i18n.t("dashboard:adminhomepage_servicios"), done: data.services.length > 0 },
    { label: i18n.t("dashboard:adminpropertiespage_ubicacion"), done: !!data.located && !!data.address?.trim() },
    { label: i18n.t("property:propertyformlayout_minimo_3_imagenes"), done: data.photos.length >= 3 },
  ]
  const complete = items.filter(item => item.done).length
  const price = data.cost > 0 ? new Intl.NumberFormat(currentLocale(), { style: 'currency', currency: data.currency, maximumFractionDigits: 2 }).format(data.cost) : i18n.t("property:propertyformlayout_precio_pendiente")
  return <div className="space-y-4">
    <article className="property-section overflow-hidden">
      <div className="relative aspect-[16/10] bg-slate-100">
        {data.photos[0] ? <img src={data.photos[0]} alt={i18n.t("property:propertyformlayout_vista_previa_de_la_propiedad")} className="size-full object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500"><Building2 size={30} /><span className="text-xs">{i18n.t("explore:explorepage_sin_fotografia")}</span></div>}
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold">{i18n.t("property:propertyformlayout_vista_previa")}</span>
        <div className="absolute bottom-3 right-3 rounded-xl bg-white px-3 py-2 text-right shadow-sm"><p className="text-sm font-bold">{price}</p><p className="text-[10px] uppercase tracking-wider text-slate-500">{i18n.t("landing:propertycard_por_mes")}</p></div>
      </div>
      <div className="space-y-3 p-4"><div><p className="text-xs text-slate-500">{data.type || i18n.t("property:propertyformlayout_tipo_de_propiedad")}</p><h3 className="mt-1 line-clamp-2 font-semibold text-slate-900">{data.title.trim() || i18n.t("property:propertyformlayout_titulo_de_la_propiedad")}</h3><p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><MapPin size={14} className="shrink-0" /><span className="truncate">{data.address || i18n.t("property:propertyformlayout_ubicacion_pendiente")}</span></p></div>
        <div className="flex flex-wrap gap-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600"><span className="flex items-center gap-1"><BedDouble size={16} />{data.rooms}{' '}{i18n.t("explore:explorepage_hab")}</span><span className="flex items-center gap-1"><Users size={16} />{data.guests}{' '}{i18n.t('common:person', { count: data.guests })}</span></div>
        <div className="flex flex-wrap gap-2">{data.services.map(service => <span key={service.id} title={catalogText(service)} className="grid size-8 place-items-center rounded-lg border border-slate-200 text-slate-600"><ServiceIcon name={service.icono} size={16} /><span className="sr-only">{catalogText(service)}</span></span>)}</div>
      </div>
    </article>
    <div className="property-section p-4"><div className="mb-3 flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{i18n.t("property:propertyformlayout_para_enviar_a_revision")}</h3><span className="text-xs text-slate-500">{complete}{' '}{i18n.t("property:propertyformlayout_de")}{' '}{items.length}</span></div>
      <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-teal-700 transition-all" style={{ width: `${complete / items.length * 100}%` }} /></div>
      <ul className="space-y-2">{items.map(item => <li key={item.label} className="flex items-center gap-2 text-sm text-slate-600">{item.done ? <CheckCircle2 size={16} className="text-teal-700" /> : <Circle size={16} className="text-slate-400" />}{item.label}<span className="sr-only">{i18n.t(item.done ? 'common:complete' : 'common:pending')}</span></li>)}</ul>
    </div><p className="flex items-start gap-2 px-1 text-xs leading-5 text-slate-500"><ShieldCheck size={18} className="shrink-0 text-teal-700" />{i18n.t("property:propertyformlayout_revisaremos_la_informacion_antes_de_publicar_tu_propiedad")}</p>
  </div>
}

export function PropertyFormLayout({ step, editing, preview, children, actions }: {
  step: 1 | 2; editing?: boolean; preview: PropertyPreview; children: ReactNode; actions: ReactNode
}) {
  useTranslation();
  const title = editing ? i18n.t("property:propertyformlayout_editar_propiedad") : i18n.t("property:propertyformlayout_nueva_propiedad")
  return <div className="property-flow flex min-h-full flex-col">
    <div className="mx-auto w-full max-w-[1160px] flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pt-8">
      <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div><nav aria-label={i18n.t("property:propertyformlayout_ruta")} className="mb-2 flex items-center gap-1 text-sm text-slate-500"><Link to="/dashboard/owner/properties" className="hover:text-primary">{i18n.t("property:propertyformlayout_mis_publicaciones")}</Link><ChevronRight size={14} /><span>{title}</span></nav>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h1><p className="mt-1 text-sm text-slate-600">{step === 1 ? i18n.t("property:propertyformlayout_cuentanos_que_hace_especial_a_tu_propiedad") : i18n.t("property:propertyformlayout_ubica_tu_propiedad_y_muestra_sus_mejores_espacios")}</p>
        </div><div><p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">{i18n.t("property:propertyformlayout_paso")}{' '}{step}{' '}{i18n.t("property:propertyformlayout_de_2")}</p><Stepper steps={PROPERTY_STEPS()} currentStep={step} /></div>
      </header>
      <div className="mt-6 grid items-start gap-6 lg:mt-8 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8"><div className="min-w-0 space-y-6">{children}
        <details className="property-section p-4 xl:hidden"><summary className="cursor-pointer text-sm font-semibold">{i18n.t("property:propertyformlayout_vista_previa_de_la_publicacion")}</summary><div className="mt-4"><Summary data={preview} /></div></details>
      </div><aside aria-label={i18n.t("property:propertyformlayout_resumen_de_la_propiedad")} className="sticky top-6 hidden xl:block"><Summary data={preview} /></aside></div>
    </div>{actions}
  </div>
}

export function PropertyActions({ step, busy, disabled, onBack, onDraft, onPrimary, finalLabel = i18n.t("property:propertyformlayout_enviar_a_revision") }: {
  step: 1 | 2; busy: boolean; disabled?: boolean; onBack?: () => void; onDraft: () => void; onPrimary: () => void; finalLabel?: string
}) {
  useTranslation();
  return <footer className="property-actions sticky bottom-0 z-20 border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
      <div>{step === 2 ? <button type="button" className="property-button" onClick={onBack} disabled={busy || disabled}><ArrowLeft size={16} />{i18n.t("property:propertyformlayout_atras")}</button> : <span className="hidden text-xs text-slate-500 sm:block">{i18n.t("property:propertyformlayout_puedes_guardar_y_continuar_mas_tarde")}</span>}</div>
      <div className="flex flex-1 gap-2 sm:flex-none"><button type="button" className="property-button flex-1" disabled={busy || disabled} onClick={onDraft}><Save size={16} /><span>{i18n.t("property:propertyformlayout_guardar_borrador")}</span></button><button type="button" className="property-button property-primary flex-1" disabled={busy || disabled} onClick={onPrimary}>{busy ? i18n.t("comments:admincommentspage_guardando") : step === 1 ? i18n.t("property:propertyformlayout_siguiente") : finalLabel}<ArrowRight size={16} /></button></div>
    </div>
  </footer>
}
