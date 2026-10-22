import { errorMessage } from '../../../i18n/messages';

/** Mensaje del backend (cuando es texto o lista de textos) o uno genérico, para mostrar al usuario. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  return errorMessage(error, fallback);
}
