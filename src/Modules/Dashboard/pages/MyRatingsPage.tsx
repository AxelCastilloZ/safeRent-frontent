import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { errorMessage } from '../../../i18n/messages'
import { useAuth } from '../../Auth/hooks/authHooks'
import TenantRatingsView from '../../TenantRatings/components/TenantRatingsView'
import { useTenantProfile } from '../../TenantRatings/hooks/tenantRatingHooks'
import { SectionError, SectionLoading } from '../Components/ClientHome/SectionStates'
import PageContainer from '../Components/PageContainer'
import PageHeader from '../Components/PageHeader'

/** Mis calificaciones: lo que los propietarios opinan del inquilino con la sesión (solo él y los administradores lo ven). */
export default function MyRatingsPage() {
  useTranslation()
  const { user } = useAuth()
  const profile = useTenantProfile(user?.id)

  return (
    <PageContainer>
      <PageHeader title={i18n.t('tenantRatings:myTitle')} description={i18n.t('tenantRatings:myDescription')} />
      {profile.isPending ? (
        <SectionLoading />
      ) : profile.isError ? (
        <SectionError message={errorMessage(profile.error, i18n.t('tenantRatings:loadError'))} onRetry={() => void profile.refetch()} />
      ) : (
        <TenantRatingsView
          profile={profile.data}
          emptyTitle={i18n.t('tenantRatings:myEmptyTitle')}
          emptyDescription={i18n.t('tenantRatings:myEmptyDescription')}
        />
      )}
    </PageContainer>
  )
}
