const STORAGE_KEY = 'saferent:visitor-id'
const VALID = /^[A-Za-z0-9_-]{16,64}$/

let remembered: string | undefined

function generate(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Código anónimo de este navegador para contar vistas de propiedades sin repetir a la misma persona.
 * No identifica a nadie. Si el almacenamiento no está disponible, dura lo que la pestaña.
 */
export function getVisitorId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && VALID.test(stored)) return stored
  } catch {
    // Sin almacenamiento (ventana privada o datos bloqueados): se usa el de la pestaña.
  }
  remembered ??= generate()
  try {
    localStorage.setItem(STORAGE_KEY, remembered)
  } catch {
    // Ver arriba.
  }
  return remembered
}
