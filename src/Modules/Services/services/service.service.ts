import type { UpdateServiceInput } from '../interfaces/service.interface'
import type {
  CreateServiceInput,
  Service,
} from '../interfaces/service.interface'

const baseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

async function readResponse(response: Response): Promise<unknown> {
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 409)
      throw new Error('Ya existe un servicio con ese nombre.')
    if (response.status === 401 || response.status === 403)
      throw new Error('No tienes permiso para administrar servicios.')
    const message =
      body && typeof body === 'object' && 'message' in body
        ? body.message
        : null
    throw new Error(
      typeof message === 'string'
        ? message
        : Array.isArray(message)
          ? message.join(' ')
          : 'No pudimos completar la solicitud. Intenta nuevamente.',
    )
  }
  return body
}

function isService(value: unknown): value is Service {
  return Boolean(
    value &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'number' &&
    'name' in value &&
    typeof value.name === 'string',
  )
}

export async function listServices(signal?: AbortSignal): Promise<Service[]> {
  const token = localStorage.getItem('token')
  const data = await readResponse(await fetch(baseUrl + '/service', {
    signal,
    headers: token ? { Authorization: 'Bearer ' + token } : {},
  }))
  if (!Array.isArray(data) || !data.every(isService))
    throw new Error('El catálogo recibido no tiene el formato esperado.')
  return data
}

export async function createService(
  input: CreateServiceInput,
): Promise<Service> {
  const token = localStorage.getItem('token')
  const response = await fetch(baseUrl + '/service', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: JSON.stringify({
      name: input.name.trim(),
      icono: input.icono,
      description: input.description?.trim() || undefined,
    }),
  })
  const data = await readResponse(response)
  if (!isService(data))
    throw new Error(
      'La respuesta no contiene el servicio creado. Revisa el catálogo antes de intentar nuevamente.',
    )
  return data
}

export async function updateService(
  id: number,
  input: UpdateServiceInput,
): Promise<Service> {
  const token = localStorage.getItem('token')
  const response = await fetch(baseUrl + '/service/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: JSON.stringify({
      ...input,
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(typeof input.description === 'string'
        ? { description: input.description.trim() }
        : {}),
    }),
  })
  const data = await readResponse(response)
  if (!isService(data))
    throw new Error(
      'La respuesta no contiene el servicio actualizado. Revisa el catálogo antes de intentar nuevamente.',
    )
  return data
}
