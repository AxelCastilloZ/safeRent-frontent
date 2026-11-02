import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import TenantRatingBadge from './TenantRatingBadge'

interface TenantLinkProps {
  tenantId: number
  name: string
  /** Muestra el puntaje junto al nombre. */
  showBadge?: boolean
}

/** Nombre de un inquilino como enlace a su perfil con las calificaciones de otros propietarios (solo para el área del propietario). */
export default function TenantLink({ tenantId, name, showBadge = true }: TenantLinkProps) {
  useTranslation()
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 align-middle">
      <Link
        to="/dashboard/owner/tenants/$tenantId"
        params={{ tenantId: String(tenantId) }}
        title={i18n.t('tenantRatings:linkTitle', { name })}
        className="font-semibold text-primary underline decoration-secondary/50 underline-offset-2 transition hover:text-secondary hover:decoration-secondary"
      >
        {name}
      </Link>
      {showBadge && <TenantRatingBadge tenantId={tenantId} />}
    </span>
  )
}

const MARKER = '\u0001name\u0001'

/**
 * Pone un enlace donde una frase traducida lleva el nombre ("Interesado: {{name}}") sin partir la traducción:
 * la frase se pide con una marca en lugar del nombre y el enlace ocupa su lugar.
 */
export function WithNameLink({ phrase, children }: { phrase: (name: string) => string; children: ReactNode }) {
  const [before, after = ''] = phrase(MARKER).split(MARKER)
  return <>{before}{children}{after}</>
}
