import { useProfile } from './profileHooks'
import { useSessionToken } from '../services/authSession'
import { useGuestCurrency } from '../utils/guestCurrency'

export function useDisplayCurrency() {
  const token = useSessionToken()
  const profile = useProfile()
  const guestCurrency = useGuestCurrency()
  return {
    currency: token ? profile.data?.resolvedCurrency ?? 'CRC' : guestCurrency,
    ready: !token || !profile.isPending,
  }
}
