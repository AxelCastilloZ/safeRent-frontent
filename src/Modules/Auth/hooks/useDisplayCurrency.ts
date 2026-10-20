import { useProfile } from './profileHooks'
import { useSessionToken } from '../services/authSession'

export function useDisplayCurrency() {
  const token = useSessionToken()
  const profile = useProfile()
  return {
    currency: token ? profile.data?.resolvedCurrency ?? 'CRC' : 'CRC',
    ready: !token || !profile.isPending,
  }
}
