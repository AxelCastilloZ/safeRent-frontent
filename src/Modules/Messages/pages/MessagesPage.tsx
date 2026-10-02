import Navbar from '../../LandingPage/Components/Navbar'
import OwnerSidebar from '../../Property/Components/OwnerSidebar'
import { useAuth } from '../../Auth/hooks/authHooks'
import MessagesLayout from '../Components/MessagesLayout'
import SessionGate from '../Components/SessionGate'

/**
 * Mensajes para cualquier usuario con sesión (inquilino o arrendatario): mismo
 * marco que el panel de propiedades (Navbar + sidebar), pero a pantalla completa
 * para que la bandeja y el chat tengan altura propia. El sidebar muestra las
 * opciones del rol de la sesión. Todavía no hay guard de rutas en el router, así
 * que la sesión se valida acá (useAuth limpia el token si el servidor responde 401).
 */
export default function MessagesPage() {
  const { hasSession } = useAuth()

  if (!hasSession) return <SessionGate />

  return (
    <div className="flex h-screen flex-col bg-white text-primary">
      <Navbar />
      <div className="flex min-h-0 flex-1 max-md:flex-col">
        <OwnerSidebar />
        <MessagesLayout />
      </div>
    </div>
  )
}
