import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { useRef, useState } from 'react'
import { Building2, ChevronLeft, ChevronRight, Images, X } from 'lucide-react'
import type { Property } from '../../Explore/interfaces/property.interface'
import { photoUrl } from '../../Explore/utils/property.utils'

function Photo({ src, alt, className }: { src: string; alt: string; className: string }) {
  useTranslation();
  const [failed, setFailed] = useState(false)
  return failed ? <div className={`${className} flex items-center justify-center bg-slate-100 text-slate-400`}>{i18n.t("property:propertygallery_fotografia_no_disponible")}</div> :
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}

export default function PropertyGallery({ property }: { property: Property }) {
  useTranslation();
  const photos = (property.files || []).filter((file) => file.mimeType.startsWith('image/'))
    .map((file) => photoUrl({ ...property, files: [file] })).filter((url): url is string => !!url)
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState(0)
  const show = (index: number) => { setSelected(index); dialog.current?.showModal() }
  if (!photos.length) return <div className="flex h-80 flex-col items-center justify-center gap-3 rounded-2xl bg-slate-100 text-slate-400"><Building2 size={48} /><p>{i18n.t("property:propertygallery_esta_propiedad_aun_no_tiene_fotografias")}</p></div>
  return <>
    <section aria-label={i18n.t("property:propertygallery_fotografias_de_la_propiedad")} className="relative grid h-72 gap-3 overflow-hidden rounded-2xl sm:h-[420px] sm:grid-cols-3">
      <button type="button" onClick={() => show(0)} aria-label={i18n.t("property:propertygallery_ampliar_fotografia_principal")} className={`min-h-0 overflow-hidden bg-slate-100 ${photos.length > 1 ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
        <Photo key={photos[0]} src={photos[0]} alt={property.title} className="h-full w-full object-cover transition hover:scale-105" />
      </button>
      {photos.length > 1 && <div className="hidden min-h-0 gap-3 sm:grid">{photos.slice(1, 3).map((url, i) => <button type="button" key={url + i} onClick={() => show(i + 1)} aria-label={i18n.t("property:propertygallery_ampliar_fotografia", { v0: i + 2 })} className="min-h-0 overflow-hidden bg-slate-100">
        <Photo key={url} src={url} alt={i18n.t("property:propertygallery_fotografia", { v0: property.title, v1: i + 2 })} className="h-full w-full object-cover transition hover:scale-105" />
      </button>)}</div>}
      <button type="button" onClick={() => show(0)} className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary shadow-lg"><Images size={18} />{i18n.t("property:propertygallery_ver_todas_las_fotos")}{photos.length})</button>
    </section>
    <dialog ref={dialog} aria-label={i18n.t("property:propertygallery_galeria_de_fotografias")}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          setSelected((current) => (current + (event.key === 'ArrowRight' ? 1 : photos.length - 1)) % photos.length)
        }
      }}
      className="fixed inset-0 m-auto max-h-[94dvh] w-[min(1100px,95vw)] max-w-none overflow-y-auto rounded-3xl border border-stone-200 bg-white p-3 text-stone-800 shadow-2xl backdrop:bg-black/65 backdrop:backdrop-blur-sm sm:p-5">
      <header className="mb-3 flex items-center gap-3 px-1 sm:mb-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold sm:text-base">{property.title}</p>
          <p className="mt-0.5 text-xs text-stone-500">{i18n.t("property:propertygallery_galeria_de_fotografias")}</p>
        </div>
        <p aria-live="polite" aria-atomic="true" className="shrink-0 rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium tabular-nums text-stone-600">{selected + 1} / {photos.length}</p>
        <button type="button" aria-label={i18n.t("property:propertygallery_cerrar_galeria")} onClick={() => dialog.current?.close()} className="shrink-0 rounded-full p-2.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"><X size={20} /></button>
      </header>
      <div className="relative overflow-hidden rounded-2xl bg-stone-100">
        <Photo key={photos[selected]} src={photos[selected]} alt={i18n.t("property:propertygallery_fotografia", { v0: property.title, v1: selected + 1 })} className="h-[min(65dvh,700px)] w-full object-contain" />
        {photos.length > 1 && <>
          <button type="button" aria-label={i18n.t("property:propertygallery_fotografia_anterior")} onClick={() => setSelected((current) => (current + photos.length - 1) % photos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-stone-200 bg-white/95 p-2 text-stone-700 shadow-md transition hover:bg-white hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:left-4 sm:p-3"><ChevronLeft size={22} /></button>
          <button type="button" aria-label={i18n.t("property:propertygallery_fotografia_siguiente")} onClick={() => setSelected((current) => (current + 1) % photos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-stone-200 bg-white/95 p-2 text-stone-700 shadow-md transition hover:bg-white hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:right-4 sm:p-3"><ChevronRight size={22} /></button>
        </>}
      </div>
    </dialog>
  </>
}
