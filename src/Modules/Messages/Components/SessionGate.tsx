import { Link } from '@tanstack/react-router'
import { LockKeyhole } from 'lucide-react'
import Navbar from '../../LandingPage/Components/Navbar'
import { buttonStyles } from './buttonStyles'

/** Pantalla que reemplaza a Mensajes cuando no hay sesión (o el token venció). */
export default function SessionGate() {
  return (
    <div className="min-h-screen bg-surface text-primary">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <LockKeyhole className="size-10 text-slate-500" aria-hidden="true" />
        <h1 className="text-2xl font-bold">Inicia sesión para ver tus mensajes</h1>
        <p className="text-slate-500">Necesitas una cuenta de SafeRent para chatear con arrendadores e inquilinos.</p>
        <Link to="/login" search={{ next: '/messages' }} className={`${buttonStyles.primaryLarge} mt-3`}>
          Iniciar sesión
        </Link>
      </main>
    </div>
  )
}
