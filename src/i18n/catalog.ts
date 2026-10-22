import i18n from './instance.ts';
import { asLanguage, type Language } from './languages.ts';

export type CatalogTranslations = Partial<Record<Language, { name: string; description?: string | null }>>;
export interface CatalogEntry {
  name: string;
  description?: string | null;
  catalogCode?: string | null;
  translations?: CatalogTranslations | null;
}

export function catalogText(entry: CatalogEntry | null | undefined, field: 'name' | 'description' = 'name', language = asLanguage(i18n.resolvedLanguage) ?? 'es'): string {
  if (!entry) return '';
  const custom = entry.translations?.[language]?.[field];
  if (custom?.trim()) return custom;
  const key = entry.catalogCode ? `catalog:${entry.catalogCode}${field === 'description' ? '_description' : ''}` : '';
  if (key && i18n.exists(key, { lng: language })) return i18n.t(key, { lng: language });
  return entry.translations?.es?.[field] || entry[field] || '';
}

export function catalogTranslations(entry: CatalogEntry): CatalogTranslations {
  return Object.fromEntries((['es', 'en', 'fr', 'pt'] as const).map(language => [language, {
    name: catalogText(entry, 'name', language), description: catalogText(entry, 'description', language),
  }]));
}

export function completeTranslations(value: CatalogTranslations, description: string): boolean {
  return (['en', 'fr', 'pt'] as const).every(language => Boolean(value[language]?.name.trim()) && (!description.trim() || Boolean(value[language]?.description?.trim())));
}
