import { useEffect } from 'react';
import { useProfile } from '../Modules/Auth/hooks/profileHooks';
import { useSessionToken } from '../Modules/Auth/services/authSession';
import i18n from './index';
import { asLanguage } from './languages';

/** Uses the authenticated account's setting without remounting pages or losing drafts. */
export default function LanguagePreference() {
  const token = useSessionToken();
  const profile = useProfile();
  const language = asLanguage(profile.data?.preferredLanguage);
  useEffect(() => {
    if (token && language && language !== i18n.resolvedLanguage) void i18n.changeLanguage(language);
  }, [token, language]);
  return null;
}
