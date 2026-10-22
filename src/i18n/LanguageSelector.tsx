import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { updateLanguage } from '../Modules/Auth/services/profileServices';
import { useSessionToken } from '../Modules/Auth/services/authSession';
import { getStoredToken } from '../Modules/Auth/utils/sessionToken';
import { asLanguage, languages, languageNames, type Language } from './languages';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation('settings');
  const id = useId();
  const token = useSessionToken();
  const queryClient = useQueryClient();
  const mutation = useMutation({ mutationFn: updateLanguage, retry: false });
  const language = asLanguage(i18n.resolvedLanguage) ?? 'es';

  async function changeLanguage(next: Language) {
    if (next === language || mutation.isPending) return;
    mutation.reset();
    if (token) {
      // Save before applying: a failed request leaves both account and interface unchanged.
      try { await mutation.mutateAsync(next); } catch { return; }
      if (getStoredToken() !== token) return;
      await queryClient.cancelQueries({ queryKey: ['auth', 'profile', token] });
      queryClient.setQueryData(['auth', 'profile', token], (profile: Record<string, unknown> | undefined) =>
        profile ? { ...profile, preferredLanguage: next } : profile);
    }
    await i18n.changeLanguage(next);
    if (token && getStoredToken() === token) void queryClient.invalidateQueries({ queryKey: ['auth', 'profile', token] });
  }

  return <div className="space-y-2">
    <label htmlFor={id} className="sr-only">{t('language')}</label>
    <select id={id} value={language} disabled={mutation.isPending} aria-busy={mutation.isPending}
      aria-describedby={mutation.isError ? `${id}-error` : undefined}
      onChange={event => void changeLanguage(event.target.value as Language)}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-primary disabled:opacity-60">
      {languages.map(value => <option key={value} value={value} lang={value}>{languageNames[value]}</option>)}
    </select>
    {mutation.isPending && <p role="status" className="text-sm text-muted-ink">{t('saving')}</p>}
    {mutation.isError && <p id={`${id}-error`} role="alert" className="text-sm text-red-700">{t('languageSaveError')}</p>}
  </div>;
}
