import { useTranslation } from 'react-i18next';
import { useState, type ReactNode } from 'react';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import PendingNotice from '../Components/PendingNotice';
import ProfilePanel from '../Components/ProfilePanel';
import LanguageSelector from '../../../i18n/LanguageSelector';
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
  const { t } = useTranslation();
  const [changingPassword, setChangingPassword] = useState(false);

  return (
    <PageContainer>
      <PageHeader title={t("navigation:settings")} description={t("settings:description")} />

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingsSection id="settings-profile" title={t("settings:profile")} description={t("settings:profileDescription")}>
          <ProfilePanel />
        </SettingsSection>

        <SettingsSection id="settings-security" title={t("settings:security")} description={t("settings:securityDescription")}>
          <button type="button" onClick={() => setChangingPassword(true)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary hover:bg-slate-50">{t("settings:changePassword")}</button>
          <p className="text-sm text-muted-ink">{t("settings:passwordDescription")}</p>
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

        <SettingsSection id="settings-language" title={t("settings:language")} description={t("settings:languageDescription")}>
          <LanguageSelector />
        </SettingsSection>

        <SettingsSection id="settings-appearance" title={t("settings:appearance")} description={t("settings:appearanceDescription")}>
          <fieldset className="grid grid-cols-3 gap-2" disabled>
            <legend className="sr-only">{t("settings:theme")}</legend>
            {[t("settings:light"), t("settings:dark"), t("settings:system")].map((label, index) => (
              <label key={label} className={`${optionClass} justify-center`}>
                <input type="radio" name="theme" defaultChecked={index === 0} className="sr-only" />
                {label}
              </label>
            ))}
          </fieldset>
          <PendingNotice>{t("settings:appearancePending")}</PendingNotice>
        </SettingsSection>
      </div>
      {changingPassword && <ChangePasswordDialog onClose={() => setChangingPassword(false)} />}
    </PageContainer>
  );
}

