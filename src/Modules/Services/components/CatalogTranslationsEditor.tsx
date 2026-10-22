import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import type { CatalogTranslations } from '../../../i18n/catalog';
import { languageNames } from '../../../i18n/languages';

export default function CatalogTranslationsEditor({ value, onChange, disabled }: { value: CatalogTranslations; onChange: (value: CatalogTranslations) => void; disabled?: boolean }) {
  const { t } = useTranslation();
  const id = useId();
  return <fieldset disabled={disabled} className="min-w-0 space-y-4 rounded-xl border border-slate-200 p-4">
    <legend>{t('catalog:translations')}</legend>
    <p className="text-sm">{t('catalog:translationsHint')}</p>
    {(['en', 'fr', 'pt'] as const).map(language => <fieldset key={language} className="min-w-0 space-y-2">
      <legend lang={language}>{languageNames[language]}</legend>
      <label className="block text-sm font-medium" htmlFor={`${id}-${language}-name`}>{t('catalog:name')}</label>
      <input className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" id={`${id}-${language}-name`} lang={language} required maxLength={100} value={value[language]?.name ?? ''}
        onChange={event => onChange({ ...value, [language]: { ...value[language], name: event.target.value } })} />
      <label className="block text-sm font-medium" htmlFor={`${id}-${language}-description`}>{t('catalog:description')}</label>
      <textarea className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm" id={`${id}-${language}-description`} lang={language} maxLength={255} rows={2} value={value[language]?.description ?? ''}
        onChange={event => onChange({ ...value, [language]: { name: value[language]?.name ?? '', description: event.target.value } })} />
    </fieldset>)}
  </fieldset>;
}
