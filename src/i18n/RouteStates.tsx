import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export function RouteError() {
  const { t } = useTranslation();
  return <main className="grid min-h-svh place-content-center gap-4 bg-surface p-6 text-center text-primary">
    <h1 className="text-2xl font-bold">{t('errors:pageError')}</h1>
    <p>{t('errors:unavailable')}</p>
    <button type="button" className="rounded-lg bg-primary px-4 py-2 text-white" onClick={() => window.location.reload()}>{t('common:retry')}</button>
  </main>;
}

export function RouteNotFound() {
  const { t } = useTranslation();
  return <main className="grid min-h-svh place-content-center gap-4 bg-surface p-6 text-center text-primary">
    <h1 className="text-2xl font-bold">{t('errors:pageNotFound')}</h1>
    <Link to="/" className="font-semibold underline">{t('navigation:home')}</Link>
  </main>;
}

export function RoutePending() {
  const { t } = useTranslation();
  return <p role="status" className="p-8 text-center text-primary">{t('common:loading')}</p>;
}
