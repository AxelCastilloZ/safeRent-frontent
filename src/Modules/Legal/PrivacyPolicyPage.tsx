import { formatDate } from '../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/instance';
import LegalPageLayout from './LegalPageLayout'
import { privacyPolicySections } from './data/privacyPolicy'

export default function PrivacyPolicyPage() {
  useTranslation();
  return (
    <LegalPageLayout
      eyebrow={i18n.t("landing:footer_legal")}
      title={i18n.t("landing:footer_politica_de_privacidad")}
      description={i18n.t("legal:privacypolicypage_como_saferent_recopila_utiliza_y_protege_la_informacion_de")}
      lastUpdated={formatDate('2026-09-23', { day: 'numeric', month: 'long', year: 'numeric' })}
      sections={privacyPolicySections()}
    />
  )
}
