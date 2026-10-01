import { useRef, useState } from 'react'
import { Building2, ChevronLeft, ChevronRight, Images, X } from 'lucide-react'
import type { Property } from '../../Explore/interfaces/property.interface'
import { photoUrl } from '../../Explore/utils/property.utils'

function Photo({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? <div className={`${className} flex items-center justify-center bg-slate-100 text-slate-400`}>Fotografía no disponible</div> :
    <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}

export default function PropertyGallery({ property }: { property: Property }) {
  const photos = (property.files || []).filter((file) => file.mimeType.startsWith('image/'))
    .map((file) => photoUrl({ ...property, files: [file] })).filter((url): url is string => !!url)
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState(0)
  const show = (index: number) => { setSelected(index); dialog.current?.showModal() }
  if (!photos.length) return <div className="flex h-80 flex-col items-center justify-center gap-3 rounded-2xl bg-slate-100 text-slate-400"><Building2 size={48} /><p>Esta propiedad aún no tiene fotografías.</p></div>
  return <>
    <section aria-label="Fotografías de la propiedad" className="relative grid h-72 gap-3 overflow-hidden rounded-2xl sm:h-[420px] sm:grid-cols-3">
      <button type="button" onClick={() => show(0)} aria-label="Ampliar fotografía principal" className={`min-h-0 overflow-hidden bg-slate-100 ${photos.length > 1 ? 'sm:col-span-2' : 'sm:col-span-3'}`}>
        <Photo src={photos[0]} alt={property.title} className="h-full w-full object-cover transition hover:scale-105" />
      </button>
      {photos.length > 1 && <div className="hidden min-h-0 gap-3 sm:grid">{photos.slice(1, 3).map((url, i) => <button type="button" key={url + i} onClick={() => show(i + 1)} aria-label={`Ampliar fotografía ${i + 2}`} className="min-h-0 overflow-hidden bg-slate-100">
        <Photo src={url} alt={`${property.title}, fotografía ${i + 2}`} className="h-full w-full object-cover transition hover:scale-105" />
      </button>)}</div>}
      <button type="button" onClick={() => show(0)} className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary shadow-lg"><Images size={18} />Ver todas las fotos ({photos.length})</button>
    </section>
    <dialog ref={dialog} aria-label="Galería de fotografías" className="fixed inset-0 m-auto w-[min(1100px,95vw)] max-w-none rounded-2xl bg-primary p-4 text-white backdrop:bg-black/80">
      <header className="mb-3 flex items-center justify-between"><p>{selected + 1} / {photos.length}</p><button type="button" aria-label="Cerrar galería" onClick={() => dialog.current?.close()} className="rounded-lg p-2 hover:bg-white/10"><X /></button></header>
      <Photo key={photos[selected]} src={photos[selected]} alt={`${property.title}, fotografía ${selected + 1}`} className="h-[65vh] w-full object-contain" />
      <div className="mt-3 flex justify-between">
        <button type="button" aria-label="Fotografía anterior" onClick={() => setSelected((selected + photos.length - 1) % photos.length)} className="rounded-lg p-3 hover:bg-white/10"><ChevronLeft /></button>
        <button type="button" aria-label="Fotografía siguiente" onClick={() => setSelected((selected + 1) % photos.length)} className="rounded-lg p-3 hover:bg-white/10"><ChevronRight /></button>
      </div>
    </dialog>
  </>
}
