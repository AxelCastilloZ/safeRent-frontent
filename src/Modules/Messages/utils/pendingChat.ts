// Intención "chatear con el propietario" guardada mientras el usuario inicia sesión.
// sessionStorage: sobrevive a la ida y vuelta por /login y se borra al cerrar la pestaña.
const KEY = 'saferent:pending-chat-property'

export function setPendingChatProperty(propertyId: number): void {
  try {
    sessionStorage.setItem(KEY, String(propertyId))
  } catch {
    // Sin sessionStorage el usuario solo tendrá que volver a pulsar el botón.
  }
}

/** Devuelve la propiedad pendiente (y la borra), o null si no había. */
export function consumePendingChatProperty(): number | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw === null) return null
    sessionStorage.removeItem(KEY)
    const id = Number(raw)
    return Number.isInteger(id) && id > 0 ? id : null
  } catch {
    return null
  }
}
