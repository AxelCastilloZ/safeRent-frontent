import axios from 'axios'

/** Mensaje del backend (cuando es texto o lista de textos) o uno genérico, para mostrar al usuario. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message: unknown = error.response?.data?.message
    if (typeof message === 'string') return message
    if (Array.isArray(message) && message.every((item) => typeof item === 'string')) return message.join(' ')
  }
  return fallback
}
