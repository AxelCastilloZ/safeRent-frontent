import { formatDate } from '../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/instance';
import LegalPageLayout from './LegalPageLayout'
import { termsOfServiceSections } from './data/termsOfService'

export default function TermsOfServicePage() {
  useTranslation();
  return (
    <LegalPageLayout
      eyebrow={i18n.t("landing:footer_legal")}
      title={i18n.t("landing:footer_terminos_del_servicio")}
      description={i18n.t("legal:termsofservicepage_las_condiciones_que_rigen_el_uso_de_saferent_como")}
      lastUpdated={formatDate('2026-09-23', { day: 'numeric', month: 'long', year: 'numeric' })}
      sections={termsOfServiceSections()}
    />
  )
}
