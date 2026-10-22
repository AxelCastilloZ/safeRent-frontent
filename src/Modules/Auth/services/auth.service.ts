import i18n from '../../../i18n/instance';
import { apiBase } from '../../Explore/services/api.service'

export async function login(email: string, password: string) {
  const response = await fetch(apiBase + '/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) throw new Error(response.status === 401 ? i18n.t("auth:auth.service_correo_o_contrasena_incorrectos") : i18n.t("auth:auth.service_no_pudimos_iniciar_sesion_intenta_nuevamente"))
  const data: { access_token: string } = await response.json()
  localStorage.setItem('token', data.access_token)
}
