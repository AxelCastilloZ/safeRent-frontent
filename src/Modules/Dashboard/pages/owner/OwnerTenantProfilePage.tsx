import { useState } from 'react'
import { useParams, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../../i18n/instance'
import { errorMessage } from '../../../../i18n/messages'
import RateTenantDialog from '../../../TenantRatings/components/RateTenantDialog'
import TenantRatingsView from '../../../TenantRatings/components/TenantRatingsView'
import { useTenantProfile } from '../../../TenantRatings/hooks/tenantRatingHooks'
import type { MyReservationRating } from '../../../TenantRatings/types/tenantRating'
import { SectionError, SectionLoading } from '../../Components/ClientHome/SectionStates'
import PageContainer from '../../Components/PageContainer'
import PageHeader from '../../Components/PageHeader'

/** Perfil de un inquilino para el propietario: su puntaje y lo que otros propietarios opinan, para decidir si es confiable. */
export default function OwnerTenantProfilePage() {
  useTranslation()
  const router = useRouter()
  const { tenantId } = useParams({ strict: false })
  const profile = useTenantProfile(Number(tenantId))
  const [rating, setRating] = useState<MyReservationRating | null>(null)

  const back = (
    <button type="button" onClick={() => router.history.back()} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-primary transition hover:border-secondary">
      <ArrowLeft size={16} aria-hidden="true" />{i18n.t('tenantRatings:back')}
    </button>
  )

  return (
    <PageContainer>
      <PageHeader
        title={profile.data ? profile.data.tenant.name : i18n.t('tenantRatings:profileTitle')}
        description={i18n.t('tenantRatings:profileDescription')}
        actions={back}
      />
      {profile.isPending ? (
        <SectionLoading />
      ) : profile.isError ? (
        <SectionError message={errorMessage(profile.error, i18n.t('tenantRatings:loadError'))} onRetry={() => void profile.refetch()} />
      ) : (
        <>
          <TenantRatingsView
            profile={profile.data}
            onRate={setRating}
            emptyTitle={i18n.t('tenantRatings:emptyTitle')}
            emptyDescription={i18n.t('tenantRatings:emptyDescription')}
          />
          {rating && <RateTenantDialog tenantName={profile.data.tenant.name} reservation={rating} onClose={() => setRating(null)} />}
        </>
      )}
    </PageContainer>
  )
}
