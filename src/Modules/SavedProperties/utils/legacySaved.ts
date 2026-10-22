// Antes "Guardar" solo vivía en este navegador: una clave `saved-property-<id>` = 'true' por propiedad.
// Estas funciones sirven únicamente para subir esas guardadas a la cuenta una vez y limpiarlas.
const PREFIX = 'saved-property-'

function legacyKeys(): string[] {
  const keys: string[] = []
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)
    if (key?.startsWith(PREFIX)) keys.push(key)
  }
  return keys
}

/** Ids guardados en este dispositivo con el sistema anterior (vacío si no hay acceso a localStorage). */
export function readLegacySavedIds(): number[] {
  try {
    return legacyKeys()
      .filter((key) => localStorage.getItem(key) === 'true')
      .map((key) => Number(key.slice(PREFIX.length)))
      .filter((id) => Number.isInteger(id) && id > 0)
  } catch {
    return []
  }
}

/** Borra las claves del sistema anterior, ya importadas a la cuenta. */
export function clearLegacySaved(): void {
  try {
    legacyKeys().forEach((key) => localStorage.removeItem(key))
  } catch {
    // Sin localStorage no hay nada que limpiar.
  }
}
