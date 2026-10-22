import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import type { ReservationState } from '../models/reservation'

export default function ReservationLabel({ property }: { property: ReservationState }) {
  useTranslation();
  if (!property.reservedTenantId) return null
  return <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">{i18n.t("dashboard:recentsavedsection_reservada")}</p>
}
