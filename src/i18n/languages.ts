export const languages = ['es', 'en', 'fr', 'pt'] as const;
export type Language = typeof languages[number];
export const languageNames: Record<Language, string> = {
  es: 'Español', en: 'English', fr: 'Français', pt: 'Português',
};
export const locales: Record<Language, string> = {
  es: 'es-CR', en: 'en-US', fr: 'fr-FR', pt: 'pt-BR',
};
export const LANGUAGE_STORAGE_KEY = 'saferent.language';

export function asLanguage(value: unknown): Language | undefined {
  if (typeof value !== 'string') return undefined;
  const base = value.toLowerCase().split('-')[0];
  return languages.find(language => language === base);
}

export function detectLanguage(): Language {
  if (typeof window !== 'undefined') {
    const linked = asLanguage(new URLSearchParams(window.location.search).get('lang'));
    if (linked) return linked;
  }
  try {
    const stored = asLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
    if (stored) return stored;
  } catch { /* Browser storage can be unavailable. */ }
  for (const candidate of navigator.languages ?? [navigator.language]) {
    const language = asLanguage(candidate);
    if (language) return language;
  }
  return 'es';
}
