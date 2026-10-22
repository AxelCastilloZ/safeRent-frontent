import { useEffect } from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export default function RootLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  useEffect(() => {
    const key = pathname === '/' ? 'metadata:home'
      : pathname.includes('politica-de-privacidad') ? 'auth:privacy'
      : pathname.includes('terminos-del-servicio') ? 'auth:terms'
      : pathname.includes('sobre-nosotros') ? 'landing:footer_sobre_nosotros'
      : pathname.includes('soporte') ? 'landing:footer_soporte'
      : pathname.startsWith('/admin/services') ? 'services:servicesadminpage_servicios_del_catalogo'
      : pathname.includes('settings') ? 'settings:title'
      : pathname.includes('messages') ? 'navigation:messages'
      : pathname.includes('reservations') ? 'navigation:reservations'
      : pathname.includes('saved') ? 'navigation:saved'
      : pathname.includes('login') ? 'auth:signIn'
      : pathname.includes('register') ? 'auth:createTitle'
      : pathname.includes('forgot-password') ? 'auth:recoveryTitle'
      : pathname.includes('reset-password') ? 'auth:resetTitle'
      : pathname.includes('explorar') ? 'navigation:explore'
      : pathname.includes('properties') ? 'navigation:allProperties'
      : pathname.includes('dashboard') ? 'navigation:summary' : 'metadata:home';
    document.title = `${t(key)} | SafeRent`;
    let description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!description) { description = document.createElement('meta'); description.name = 'description'; document.head.appendChild(description); }
    description.content = t('metadata:description');
  }, [pathname, t]);
  return <Outlet />;
}
