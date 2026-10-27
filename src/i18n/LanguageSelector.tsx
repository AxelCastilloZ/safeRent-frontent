import { useId } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { updateLanguage } from '../Modules/Auth/services/profileServices';
import { useSessionToken } from '../Modules/Auth/services/authSession';
import { getStoredToken } from '../Modules/Auth/utils/sessionToken';
import { asLanguage, languages, languageNames, type Language } from './languages';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
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
    <Select value={language} disabled={mutation.isPending} onValueChange={value => void changeLanguage(value as Language)}>
      <SelectTrigger id={id} aria-busy={mutation.isPending} aria-describedby={mutation.isError ? `${id}-error` : undefined}>
        {compact ? <span>{language.toUpperCase()}</span> : <SelectValue />}
      </SelectTrigger>
      <SelectContent>
        {languages.map(value => <SelectItem key={value} value={value} lang={value}>{languageNames[value]}</SelectItem>)}
      </SelectContent>
    </Select>
    {mutation.isPending && <p role="status" className="text-sm text-muted-ink">{t('saving')}</p>}
    {mutation.isError && <p id={`${id}-error`} role="alert" className="text-sm text-red-700">{t('languageSaveError')}</p>}
  </div>;
}
