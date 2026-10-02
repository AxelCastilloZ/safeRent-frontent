/** Solo se aceptan rutas internas ("/algo"): evita redirigir a sitios externos tras el login. */
export function isSafeRedirect(path: unknown): path is string {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\');
}
