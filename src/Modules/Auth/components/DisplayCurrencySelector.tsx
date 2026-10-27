import { useId } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import apiAxios from '../../../api/apiConfig';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import type { Profile } from '../services/profileServices';
import { useSessionToken } from '../services/authSession';
import { getStoredToken } from '../utils/sessionToken';
import { setGuestCurrency } from '../utils/guestCurrency';
import { useDisplayCurrency } from '../hooks/useDisplayCurrency';

export default function DisplayCurrencySelector() {
  const { t } = useTranslation('settings');
  const id = useId();
  const token = useSessionToken();
  const { currency, ready } = useDisplayCurrency();
  const client = useQueryClient();
  const options = useQuery({ queryKey: ['display-currency-options'], queryFn: async () =>
    (await apiAxios.get<{ currencies: { code: string }[] }>('/auth/display-currencies')).data,
    staleTime: Infinity, retry: false });
  const save = useMutation({ mutationFn: async (preferredCurrency: string) => {
    await apiAxios.patch('/auth/currency', { preferredCurrency });
    return preferredCurrency;
  } });
  async function change(next: string) {
    if (next === currency || save.isPending) return;
    save.reset();
    if (!token) { setGuestCurrency(next); return; }
    try { await save.mutateAsync(next); } catch { return; }
    if (getStoredToken() !== token) return;
    await client.cancelQueries({ queryKey: ['auth', 'profile', token] });
    client.setQueryData<Profile>(['auth', 'profile', token], profile => profile ? {
      ...profile, preferredCurrency: next, resolvedCurrency: next, currencySource: 'preference',
    } : profile);
    void client.invalidateQueries({ queryKey: ['auth', 'profile', token] });
  }
  const currencies = options.data?.currencies ?? [...new Set([currency, 'CRC', 'USD', 'EUR'])].map(code => ({ code }));
  return <div className="relative w-20 shrink-0">
    <Select value={currency} disabled={!ready || save.isPending} onValueChange={value => void change(value)}>
      <SelectTrigger aria-label={t('profileCurrency')} aria-busy={save.isPending} aria-describedby={save.isError ? id : undefined}><SelectValue /></SelectTrigger>
      <SelectContent>{currencies.map(option => <SelectItem key={option.code} value={option.code}>{option.code}</SelectItem>)}</SelectContent>
    </Select>
    {save.isError && <p id={id} role="alert" className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-red-200 bg-white p-3 text-xs text-red-700 shadow">{t('currencySaveError')}</p>}
  </div>;
}
