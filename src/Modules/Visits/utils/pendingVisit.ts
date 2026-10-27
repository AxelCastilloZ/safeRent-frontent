// Intención "agendar cita" recordada mientras el usuario inicia sesión.
// sessionStorage: sobrevive a la ida y vuelta por /login y se borra al cerrar la pestaña.
const KEY = 'saferent:pending-visit-property'

export function setPendingVisitProperty(propertyId: number): void {
  try {
    sessionStorage.setItem(KEY, String(propertyId))
  } catch {
    // Sin sessionStorage la persona solo tendrá que volver a pulsar "Agendar cita".
  }
}

/** Propiedad pendiente, o null si no había. Solo lee: es seguro llamarla al renderizar. */
export function peekPendingVisitProperty(): number | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    const id = Number(raw)
    return raw !== null && Number.isInteger(id) && id > 0 ? id : null
  } catch {
    return null
  }
}

export function clearPendingVisitProperty(): void {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // Nada que limpiar.
  }
}
