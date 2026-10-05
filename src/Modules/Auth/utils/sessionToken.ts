/** Lectura puntual del token guardado (para los guards del router, que viven fuera de React). */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}
