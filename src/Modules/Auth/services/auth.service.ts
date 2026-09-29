const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function login(email: string, password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message ?? 'Credenciales inválidas')
  }

  localStorage.setItem('token', data.access_token)
}
