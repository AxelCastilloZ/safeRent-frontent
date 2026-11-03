import { Coins } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n/instance'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select'
import { EMPTY_ENVIRONMENT_FILTERS, activeEnvironmentFilterCount, priceRangeInvalid, type EnvironmentFilterState } from './utils/environmentFilters'

const STABILITY = ['3', '4', '5']
const INTERNET = ['10', '25', '50', '100', '300']
const DISTANCE = ['1', '3', '5', '10']

function FilterSelect({ label, value, options, format, onChange }: {
  label: string
  value: string
  options: string[]
  format: (option: string) => string
  onChange: (value: string) => void
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold text-primary">{label}</p>
      <Select value={value || 'any'} onValueChange={(next) => onChange(next === 'any' ? '' : next)}>
        <SelectTrigger aria-label={label} className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="any">{i18n.t('explore:envAny')}</SelectItem>
          {options.map((option) => <SelectItem key={option} value={option}>{format(option)}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  )
}

interface EnvironmentFiltersProps {
  state: EnvironmentFilterState
  onChange: (state: EnvironmentFilterState) => void
  /** Código de la moneda en la que el visitante ve los precios (CRC, USD…). */
  currency: string
}

/** Botón y panel "Precio y entorno". El entorno sale del promedio de las encuestas de los inquilinos que ya vivieron en cada propiedad. */
export default function EnvironmentFilters({ state, onChange, currency }: EnvironmentFiltersProps) {
  useTranslation()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const active = activeEnvironmentFilterCount(state)
  const set = (patch: Partial<EnvironmentFilterState>) => onChange({ ...state, ...patch })
  const invalidRange = priceRangeInvalid(state)
  const priceField = 'mt-1 block w-full rounded-lg border border-slate-300 p-2 text-sm'

  return (
    <>
      <button type="button" className={open ? 'filter-pill active' : 'filter-pill'} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        <Coins size={16} />{i18n.t('explore:envPill')}{active > 0 && ` (${active})`}
      </button>
      {open && (
        <div id={panelId} className="expanded-filters">
          <fieldset>
            <legend className="filter-section-label">{i18n.t('explore:envPriceLegend', { currency })}</legend>
            <div className="mt-1 grid grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-primary">
                {i18n.t('explore:envMinPrice')}
                <input type="number" inputMode="decimal" min={0} value={state.minPrice} onChange={(event) => set({ minPrice: event.target.value })} aria-invalid={invalidRange} className={priceField} />
              </label>
              <label className="text-xs font-semibold text-primary">
                {i18n.t('explore:envMaxPrice')}
                <input type="number" inputMode="decimal" min={0} value={state.maxPrice} onChange={(event) => set({ maxPrice: event.target.value })} aria-invalid={invalidRange} className={priceField} />
              </label>
            </div>
            {invalidRange && <p role="alert" className="filter-validation mt-1">{i18n.t('explore:envPriceInvalid')}</p>}
          </fieldset>

          <fieldset className="mt-4">
            <legend className="filter-section-label">{i18n.t('explore:envLegend')}</legend>
            <p className="service-filter-hint">{i18n.t('explore:envHint')}</p>
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FilterSelect label={i18n.t('explore:envWater')} value={state.water} options={STABILITY} format={(option) => i18n.t('explore:envAtLeastScore', { value: option })} onChange={(water) => set({ water })} />
              <FilterSelect label={i18n.t('explore:envElectricity')} value={state.electricity} options={STABILITY} format={(option) => i18n.t('explore:envAtLeastScore', { value: option })} onChange={(electricity) => set({ electricity })} />
              <FilterSelect label={i18n.t('explore:envInternet')} value={state.internet} options={INTERNET} format={(option) => i18n.t('explore:envAtLeastMbps', { value: option })} onChange={(internet) => set({ internet })} />
              <FilterSelect label={i18n.t('explore:envUniversity')} value={state.university} options={DISTANCE} format={(option) => i18n.t('explore:envWithinKm', { value: option })} onChange={(university) => set({ university })} />
              <FilterSelect label={i18n.t('explore:envCoworking')} value={state.coworking} options={DISTANCE} format={(option) => i18n.t('explore:envWithinKm', { value: option })} onChange={(coworking) => set({ coworking })} />
              <label className="flex items-center gap-2 self-end rounded-lg border border-slate-300 p-2 text-sm text-primary">
                <input type="checkbox" checked={state.workArea} onChange={(event) => set({ workArea: event.target.checked })} />
                {i18n.t('explore:envWorkArea')}
              </label>
            </div>
          </fieldset>

          <div className="service-filter-footer">
            <button type="button" className="service-filter-clear" disabled={active === 0 && !state.minPrice && !state.maxPrice} onClick={() => onChange(EMPTY_ENVIRONMENT_FILTERS)}>{i18n.t('explore:envClear')}</button>
          </div>
        </div>
      )}
    </>
  )
}
