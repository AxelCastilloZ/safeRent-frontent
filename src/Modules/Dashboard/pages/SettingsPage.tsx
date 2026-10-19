import { useState, type ReactNode } from 'react';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import PendingNotice from '../Components/PendingNotice';
import ProfilePanel from '../Components/ProfilePanel';
import ChangePasswordDialog from '../Components/ChangePasswordDialog';

function SettingsSection({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 id={id} className="text-lg font-bold text-primary">
        {title}
      </h2>
      <p className="mt-1 text-sm text-muted-ink">{description}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

const optionClass = 'flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-primary opacity-60';

/** Ajustes (compartida por las tres áreas). Perfil y seguridad integrados con el backend. */
export default function SettingsPage() {
  const [changingPassword, setChangingPassword] = useState(false);

  return (
    <PageContainer>
      <PageHeader title="Ajustes" description="Administra tu perfil, tu seguridad y tus preferencias." />

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingsSection id="settings-profile" title="Perfil" description="Los datos con los que apareces en SafeRent.">
          <ProfilePanel />
        </SettingsSection>

        <SettingsSection id="settings-security" title="Seguridad" description="Protege el acceso a tu cuenta.">
          <button type="button" onClick={() => setChangingPassword(true)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-50">
            Cambiar contraseña
          </button>
          <p className="text-sm text-muted-ink">Actualiza tu contraseña para proteger tu cuenta.</p>
        </SettingsSection>

        {/* <SettingsSection id="settings-notifications" title="Notificaciones" description="Elige de qué quieres enterarte.">
          {['Mensajes nuevos', 'Actualizaciones de reservaciones'].map((label) => (
            <label key={label} className={optionClass}>
              <input type="checkbox" disabled />
              {label}
            </label>
          ))}
          <PendingNotice>preferencias de notificación — no existen notificaciones en el backend.</PendingNotice>
        </SettingsSection> */}

        <SettingsSection id="settings-language" title="Idioma" description="El idioma de la interfaz.">
          <fieldset className="space-y-2" disabled>
            <legend className="sr-only">Idioma</legend>
            {['Español', 'English'].map((label, index) => (
              <label key={label} className={optionClass}>
                <input type="radio" name="language" defaultChecked={index === 0} />
                {label}
              </label>
            ))}
          </fieldset>
          <PendingNotice>cambio de idioma — el sitio aún no está internacionalizado.</PendingNotice>
        </SettingsSection>

        <SettingsSection id="settings-appearance" title="Apariencia" description="Claro, oscuro o el del sistema.">
          <fieldset className="grid grid-cols-3 gap-2" disabled>
            <legend className="sr-only">Tema</legend>
            {['Claro', 'Oscuro', 'Sistema'].map((label, index) => (
              <label key={label} className={`${optionClass} justify-center`}>
                <input type="radio" name="theme" defaultChecked={index === 0} className="sr-only" />
                {label}
              </label>
            ))}
          </fieldset>
          <PendingNotice>modo oscuro y del sistema — diferido hasta definir el tema de toda la aplicación.</PendingNotice>
        </SettingsSection>
      </div>
      {changingPassword && <ChangePasswordDialog onClose={() => setChangingPassword(false)} />}
    </PageContainer>
  );
}

