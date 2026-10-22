import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { asLanguage, detectLanguage, languages, LANGUAGE_STORAGE_KEY } from './languages';

const files = import.meta.glob('./locales/*/*.json', { eager: true, import: 'default' });
const resources: Record<string, Record<string, Record<string, unknown>>> = {};
for (const [path, dictionary] of Object.entries(files)) {
  const [, language, namespace] = path.match(/locales\/([^/]+)\/([^/]+)\.json$/)!;
  (resources[language] ??= {})[namespace] = dictionary as Record<string, unknown>;
}

function applyLanguage(value: string) {
  const language = asLanguage(value) ?? 'es';
  document.documentElement.lang = language;
  document.documentElement.dir = 'ltr';
  try { localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* Keep the in-memory preference. */ }
}

i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  supportedLngs: [...languages],
  fallbackLng: 'es',
  load: 'languageOnly',
  keySeparator: false,
  defaultNS: 'common',
  ns: Object.keys(resources.es ?? {}),
  interpolation: { escapeValue: false }, // React escapes text; never inject translations as HTML.
  returnEmptyString: false,
  initAsync: false,
  react: { useSuspense: false },
});
i18n.on('languageChanged', applyLanguage);
applyLanguage(i18n.resolvedLanguage ?? i18n.language);

export default i18n;
