import { apiBase } from '../../Explore/services/api.service'

export async function login(email: string, password: string) {
  const response = await fetch(apiBase + '/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!response.ok) throw new Error(response.status === 401 ? 'Correo o contraseña incorrectos.' : 'No pudimos iniciar sesión. Intenta nuevamente.')
  const data: { access_token: string } = await response.json()
  localStorage.setItem('token', data.access_token)
}
