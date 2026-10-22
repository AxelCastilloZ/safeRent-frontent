import { LocalizedHttpError } from '../../../i18n/messages';
import { LocalizedError } from '../../../i18n/messages';
import type { UpdateServiceInput } from '../interfaces/service.interface'
import type {
  CreateServiceInput,
  Service,
} from '../interfaces/service.interface'

const baseUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

async function readResponse(response: Response): Promise<unknown> {
  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) throw new LocalizedHttpError(response.status, body)
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
    throw new LocalizedError("services:service.service_el_catalogo_recibido_no_tiene_el_formato_esperado")
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
      translations: input.translations,
      icono: input.icono,
      description: input.description?.trim() || undefined,
    }),
  })
  const data = await readResponse(response)
  if (!isService(data))
    throw new LocalizedError("services:service.service_la_respuesta_no_contiene_el_servicio_creado_revisa_el")
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
    throw new LocalizedError("services:service.service_la_respuesta_no_contiene_el_servicio_actualizado_revisa_el")
  return data
}
