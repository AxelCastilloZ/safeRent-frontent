import { Link } from '@tanstack/react-router'
import { ArrowRight, ClipboardCheck, FileText, ImagePlus, MapPin } from 'lucide-react'
import Footer from '../LandingPage/Components/Footer'
import Navbar from '../LandingPage/Components/Navbar'
import Reveal from '../LandingPage/Components/Reveal'

const steps = [
  { title: 'Datos de la propiedad', description: 'Título, descripción, precio y servicios que ofreces.', Icon: FileText },
  { title: 'Ubicación', description: 'Busca la dirección y confírmala en el mapa.', Icon: MapPin },
  { title: 'Fotografías', description: 'Sube imágenes que muestren bien la propiedad.', Icon: ImagePlus },
  { title: 'Revisión', description: 'Un administrador la revisa y, al aprobarla, queda visible para los inquilinos.', Icon: ClipboardCheck },
]

const primaryLink =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark'
const secondaryLink =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-secondary'

/**
 * Explica cómo publicar y abre el formulario; su guard conserva el destino al iniciar sesión.
 */
export default function PublishEntryPage() {

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main className="bg-surface px-4 py-14 sm:px-6 sm:py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Para propietarios</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Publica tu propiedad en SafeRent</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral/75">
            Llega a inquilinos que buscan transparencia. Tu propiedad se publica después de una revisión del equipo de SafeRent.
          </p>
        </Reveal>

        <ol className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, description, Icon }, index) => (
            <li key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon size={20} aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-secondary-dark">Paso {index + 1}</p>
              <h3 className="mt-1 font-bold text-primary">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral/75">{description}</p>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-primary">Crea tu propiedad</h2>
          <p className="mt-2 text-sm leading-6 text-neutral/75">
            Completa los datos y envía tu propiedad a revisión. Al aprobarla, recibirás el rol de propietario.
            Si todavía no has iniciado sesión, te pediremos hacerlo antes de continuar.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/dashboard/owner/properties/new" className={primaryLink}>
              Crear propiedad
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link to="/register" search={{ next: '/dashboard/owner/properties/new' }} className={secondaryLink}>
              Crear cuenta
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
