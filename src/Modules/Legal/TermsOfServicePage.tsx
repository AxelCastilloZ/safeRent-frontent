import LegalPageLayout from './LegalPageLayout'
import { termsOfServiceSections } from './data/termsOfService'

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Términos del servicio"
      description="Las condiciones que rigen el uso de SafeRent como plataforma que conecta a arrendadores e inquilinos."
      lastUpdated="23 de septiembre de 2026"
      sections={termsOfServiceSections}
    />
  )
}
