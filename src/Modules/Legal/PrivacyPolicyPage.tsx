import LegalPageLayout from './LegalPageLayout'
import { privacyPolicySections } from './data/privacyPolicy'

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Política de privacidad"
      description="Cómo SafeRent recopila, utiliza y protege la información de sus usuarios."
      lastUpdated="23 de septiembre de 2026"
      sections={privacyPolicySections}
    />
  )
}
