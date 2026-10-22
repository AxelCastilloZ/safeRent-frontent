import axios from 'axios';
import i18n from './instance.ts';

export interface MessageDescriptor {
  key: string;
  params?: Record<string, unknown>;
  details?: { field: string; code: string; params?: Record<string, unknown> }[];
}
export const message = (key: string, params?: Record<string, unknown>): MessageDescriptor => ({ key, params });

export function resolveMessage(value: MessageDescriptor | string | null | undefined): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const text = i18n.t(value.key, value.params ?? {});
  if (!value.details?.length) return text;
  return text + ' ' + value.details.map(detail => {
    const field = i18n.t(`fields:${detail.field.split('.').at(-1)}`, { defaultValue: i18n.t('fields:field') });
    return i18n.t(`serverValidation:${detail.code}`, { ...detail.params, field, defaultValue: i18n.t('serverValidation:invalid', { field }) });
  }).join(' ');
}

export function apiMessage(payload: unknown, fallback = message('errors:unavailable')): MessageDescriptor {
  if (!payload || typeof payload !== 'object') return fallback;
  const body = payload as Record<string, unknown>;
  if (body.code === 'VALIDATION_FAILED' && Array.isArray(body.details)) {
    return { key: 'errors:invalidFields', details: body.details.filter((detail): detail is NonNullable<MessageDescriptor['details']>[number] =>
      Boolean(detail && typeof detail.field === 'string' && typeof detail.code === 'string')) };
  }
  if (typeof body.code === 'string' && i18n.exists(`api:${body.code}`)) {
    return message(`api:${body.code}`, typeof body.params === 'object' && body.params ? body.params as Record<string, unknown> : undefined);
  }
  if (body.code === 'RESET_LINK_INVALID') return message('errors:invalidLink');
  return fallback;
}

/** Keeps the machine-readable payload so cached errors follow the current locale. */
export class LocalizedError extends Error {
  readonly descriptor: MessageDescriptor;
  constructor(key: string, params?: Record<string, unknown>) {
    super();
    this.descriptor = message(key, params);
    Object.defineProperty(this, 'message', { configurable: true, get: () => resolveMessage(this.descriptor) });
  }
}

export class LocalizedHttpError extends Error {
  readonly status: number;
  readonly body: unknown;
  constructor(status: number, body: unknown) {
    super();
    this.status = status;
    this.body = body;
    Object.defineProperty(this, 'message', { configurable: true, get: () => resolveMessage(apiMessage(body)) });
  }
}

export function messageFromError(error: unknown, fallback: MessageDescriptor | string = message('errors:unavailable')): MessageDescriptor | string {
  if (error instanceof LocalizedError) return error.descriptor;
  if (axios.isAxiosError(error)) {
    if (!error.response) return message('errors:network');
    const status = error.response.status;
    return apiMessage(error.response.data, typeof fallback === 'string' ? message(status === 401 ? 'errors:sessionExpired' : status === 429 ? 'errors:attempts' : 'errors:unavailable') : fallback);
  }
  if (error && typeof error === 'object' && 'body' in error) return apiMessage(error.body, typeof fallback === 'string' ? message('errors:unavailable') : fallback);
  return fallback;
}
export function errorMessage(error: unknown, fallback?: string): string {
  return resolveMessage(messageFromError(error, fallback));
}
