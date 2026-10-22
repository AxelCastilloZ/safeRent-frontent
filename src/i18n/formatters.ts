import i18n from './instance.ts';
import { asLanguage, locales } from './languages.ts';

export function currentLocale() {
  return locales[asLanguage(i18n.resolvedLanguage ?? i18n.language) ?? 'es'];
}

export function formatDate(value: string | Date, options?: Intl.DateTimeFormatOptions) {
  // Calendar dates, including birthdays, must not move to the preceding day in UTC-6.
  const dateOnly = typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = value instanceof Date ? value : new Date(dateOnly ? `${value}T00:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(currentLocale(), { ...options, ...(dateOnly ? { timeZone: 'UTC' } : {}) }).format(date);
}

export function displayName(code: string | null | undefined, type: 'region' | 'currency') {
  if (!code) return i18n.t('settings:unspecified');
  try { return new Intl.DisplayNames([currentLocale()], { type }).of(code) ?? code; }
  catch { return code; }
}
