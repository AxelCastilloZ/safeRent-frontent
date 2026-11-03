import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { errorMessage } from '../../../i18n/messages'
import ConfirmDialog from '../../Dashboard/Components/ConfirmDialog'
import { useSubmitStaySurvey } from '../hooks/staySurveyHooks'
import type { MyStay } from '../types/staySurvey'

const SCALE = [1, 2, 3, 4, 5]
const FIELD = 'mt-1 block w-full rounded-lg border border-slate-300 p-2 text-sm font-normal'

/** Escala de 1 a 5 con botones: se entiende de un vistazo y no admite valores fuera de rango. */
function Scale({ label, value, onChange, disabled }: { label: string; value: number; onChange: (value: number) => void; disabled: boolean }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-primary">{label}</legend>
      <div className="mt-1 flex gap-1.5">
        {SCALE.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            disabled={disabled}
            onClick={() => onChange(option)}
            className={`size-9 rounded-lg border text-sm font-bold transition ${value === option ? 'border-secondary bg-secondary text-white' : 'border-slate-300 bg-white text-primary hover:border-secondary'}`}
          >{option}</button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-muted-ink"><span>{i18n.t('staySurvey:scaleLow')}</span><span>{i18n.t('staySurvey:scaleHigh')}</span></div>
    </fieldset>
  )
}

/** Convierte lo escrito en un número no negativo, o null si está vacío o no es válido. */
function parseDistance(text: string): number | null {
  const value = Number(text.replace(',', '.'))
  return text.trim() !== '' && Number.isFinite(value) && value >= 0 ? Math.round(value * 10) / 10 : null
}

interface StaySurveyDialogProps {
  stay: MyStay
  onClose: () => void
  /** Se llama (en vez de onClose) cuando la encuesta se envió: permite agradecer y ofrecer seguir con otra. */
  onSubmitted?: () => void
}

/** Encuesta que el inquilino responde al terminar su estadía: sus respuestas alimentan los filtros del explorador. */
export default function StaySurveyDialog({ stay, onClose, onSubmitted }: StaySurveyDialogProps) {
  useTranslation()
  const submit = useSubmitStaySurvey()
  const previous = stay.survey
  const [water, setWater] = useState(previous?.waterStability ?? 0)
  const [electricity, setElectricity] = useState(previous?.electricityStability ?? 0)
  const [internet, setInternet] = useState(previous ? String(previous.internetMbps) : '')
  const [university, setUniversity] = useState(previous?.universityKm != null ? String(previous.universityKm) : '')
  const [coworking, setCoworking] = useState(previous?.coworkingKm != null ? String(previous.coworkingKm) : '')
  const [workArea, setWorkArea] = useState<boolean | null>(previous ? previous.hasWorkArea : null)

  const internetMbps = Number(internet)
  const internetValid = internet.trim() !== '' && Number.isInteger(internetMbps) && internetMbps >= 0 && internetMbps <= 10000
  const universityValid = university.trim() === '' || parseDistance(university) !== null
  const coworkingValid = coworking.trim() === '' || parseDistance(coworking) !== null
  const complete = water > 0 && electricity > 0 && internetValid && universityValid && coworkingValid && workArea !== null

  function send() {
    if (!complete || workArea === null) return
    submit.mutate({
      reservationId: stay.reservationId,
      answers: {
        waterStability: water,
        electricityStability: electricity,
        internetMbps,
        universityKm: parseDistance(university),
        coworkingKm: parseDistance(coworking),
        hasWorkArea: workArea,
      },
    }, { onSuccess: onSubmitted ?? onClose })
  }

  return (
    <ConfirmDialog
      title={i18n.t('staySurvey:dialogTitle')}
      description={i18n.t('staySurvey:dialogDescription', { property: stay.property.title })}
      confirmLabel={i18n.t('staySurvey:send')}
      loading={submit.isPending}
      error={submit.isError ? errorMessage(submit.error) : null}
      confirmDisabled={!complete}
      onConfirm={send}
      onCancel={() => { if (!submit.isPending) onClose() }}
    >
      <div className="mb-4 space-y-4">
        <Scale label={i18n.t('staySurvey:water')} value={water} onChange={setWater} disabled={submit.isPending} />
        <Scale label={i18n.t('staySurvey:electricity')} value={electricity} onChange={setElectricity} disabled={submit.isPending} />
        <label className="block text-sm font-semibold text-primary">
          {i18n.t('staySurvey:internet')}
          <input type="number" inputMode="numeric" min={0} max={10000} step={1} value={internet} onChange={(event) => setInternet(event.target.value)} disabled={submit.isPending} placeholder="50" className={FIELD} />
          <span className="mt-1 block text-xs font-normal text-muted-ink">{i18n.t('staySurvey:internetHint')}</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-primary">
            {i18n.t('staySurvey:university')}
            <input type="text" inputMode="decimal" value={university} onChange={(event) => setUniversity(event.target.value)} disabled={submit.isPending} placeholder="2.5" aria-invalid={!universityValid} className={FIELD} />
          </label>
          <label className="block text-sm font-semibold text-primary">
            {i18n.t('staySurvey:coworking')}
            <input type="text" inputMode="decimal" value={coworking} onChange={(event) => setCoworking(event.target.value)} disabled={submit.isPending} placeholder="4" aria-invalid={!coworkingValid} className={FIELD} />
          </label>
        </div>
        <p className="-mt-2 text-xs text-muted-ink">{i18n.t('staySurvey:distanceHint')}</p>
        <fieldset>
          <legend className="text-sm font-semibold text-primary">{i18n.t('staySurvey:workArea')}</legend>
          <div className="mt-1 flex gap-2">
            {[true, false].map((option) => (
              <button
                key={String(option)}
                type="button"
                aria-pressed={workArea === option}
                disabled={submit.isPending}
                onClick={() => setWorkArea(option)}
                className={`rounded-lg border px-4 py-1.5 text-sm font-semibold transition ${workArea === option ? 'border-secondary bg-secondary text-white' : 'border-slate-300 bg-white text-primary hover:border-secondary'}`}
              >{option ? i18n.t('staySurvey:yes') : i18n.t('staySurvey:no')}</button>
            ))}
          </div>
        </fieldset>
      </div>
    </ConfirmDialog>
  )
}
