// Reservas que el inquilino ya vio en el aviso de "te reservaron una propiedad", para no repetirlo en cada entrada.
// Se guarda en este navegador; si el almacenamiento no está disponible, se recuerda mientras la pestaña siga abierta.
const memory = new Map<number, Set<number>>()

const storageKey = (userId: number) => `saferent:seen-reservations:${userId}`

function read(userId: number): Set<number> {
  const remembered = memory.get(userId) ?? new Set<number>()
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey(userId)) ?? '[]')
    if (Array.isArray(stored)) for (const id of stored) if (Number.isInteger(id)) remembered.add(id as number)
  } catch {
    // Sin almacenamiento (ventana privada o datos bloqueados): solo cuenta lo recordado en memoria.
  }
  memory.set(userId, remembered)
  return remembered
}

export function hasSeenReservation(userId: number, reservationId: number): boolean {
  return read(userId).has(reservationId)
}

export function markReservationsSeen(userId: number, reservationIds: number[]): void {
  const seen = read(userId)
  for (const id of reservationIds) seen.add(id)
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify([...seen]))
  } catch {
    // Ver arriba: queda en memoria.
  }
}
