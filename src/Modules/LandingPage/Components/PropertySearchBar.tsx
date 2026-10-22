import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { MapPin, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { useDisplayCurrency } from '../../Auth/hooks/useDisplayCurrency'

export default function PropertySearchBar() {
  useTranslation();
  const { currency, ready } = useDisplayCurrency()
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState('')
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams({ q: location })
    if (price) params.set('max', price)
    window.location.assign(`/explorar?${params}`)
  }

  return <section className="-mt-1 bg-surface px-4 pb-4 sm:px-6"><form className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/70" onSubmit={handleSubmit}>
    <div className="flex flex-col gap-2 md:flex-row">
      <label className="relative flex min-w-0 flex-1 flex-col rounded-xl px-4 py-2 transition hover:bg-slate-50 focus-within:bg-slate-50"><span className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral">{i18n.t("dashboard:adminpropertiespage_ubicacion")}</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder={i18n.t("landing:propertysearchbar_ciudad_o_universidad")} className="w-full bg-transparent pr-8 text-sm text-neutral outline-none placeholder:text-slate-400" /><MapPin className="absolute right-4 top-1/2 text-neutral/70" size={18} aria-hidden="true" /></label>
      <div className="hidden w-px bg-slate-200 md:block" />
      <label className="relative flex flex-1 flex-col rounded-xl px-4 py-2 transition hover:bg-slate-50 focus-within:bg-slate-50"><span className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral">{i18n.t("landing:propertysearchbar_presupuesto_maximo")}{currency})</span><input type="number" min="0" step="any" disabled={!ready} value={price} onChange={(event) => setPrice(event.target.value)} placeholder={i18n.t("explore:explorepage_sin_maximo")} className="w-full bg-transparent text-sm text-neutral outline-none" /></label>
      <button type="submit" disabled={!ready} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"><Search size={18} aria-hidden="true" />{i18n.t("landing:propertysearchbar_buscar")}</button>
    </div>
  </form></section>
}
