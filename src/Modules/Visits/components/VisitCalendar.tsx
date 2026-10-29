import { DayPicker } from 'react-day-picker'
import { enUS, es, fr, pt } from 'react-day-picker/locale'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { asLanguage } from '../../../i18n/languages'

const LOCALES = { es, en: enUS, fr, pt }

interface VisitCalendarProps {
  /** Día elegido (fecha local a medianoche) o undefined. */
  selected: Date | undefined
  onSelect: (day: Date) => void
  /** Solo los días con horarios libres se pueden elegir. */
  isDayFree: (day: Date) => boolean
  firstMonth: Date
  lastMonth: Date
}

/** Calendario mensual al estilo shadcn/ui, con los colores de SafeRent. Los días sin horarios libres quedan tachados. */
export default function VisitCalendar({ selected, onSelect, isDayFree, firstMonth, lastMonth }: VisitCalendarProps) {
  useTranslation()
  const locale = LOCALES[asLanguage(i18n.resolvedLanguage) ?? 'es']

  return (
    <DayPicker
      mode="single"
      locale={locale}
      selected={selected}
      onSelect={(day) => { if (day) onSelect(day) }}
      disabled={(day) => !isDayFree(day)}
      modifiers={{ free: isDayFree }}
      modifiersClassNames={{ free: '[&>button]:bg-secondary/10 [&>button]:font-bold' }}
      defaultMonth={selected ?? firstMonth}
      startMonth={firstMonth}
      endMonth={lastMonth}
      showOutsideDays={false}
      classNames={{
        root: 'w-full',
        months: 'relative',
        month_caption: 'flex h-9 items-center justify-center',
        caption_label: 'text-sm font-bold capitalize text-primary',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous: 'grid size-9 place-items-center rounded-lg text-primary transition hover:bg-slate-100 disabled:opacity-30',
        button_next: 'grid size-9 place-items-center rounded-lg text-primary transition hover:bg-slate-100 disabled:opacity-30',
        chevron: 'size-4 fill-current',
        month_grid: 'mt-2 w-full border-collapse',
        weekday: 'pb-1 text-center text-xs font-semibold uppercase text-muted-ink',
        day: 'p-0.5 text-center',
        day_button: 'mx-auto grid size-10 place-items-center rounded-full text-sm text-primary transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-secondary',
        selected: '[&>button]:!bg-primary [&>button]:!text-white [&>button]:font-bold',
        today: '[&>button]:ring-1 [&>button]:ring-secondary',
        disabled: '[&>button]:pointer-events-none [&>button]:text-slate-300 [&>button]:line-through',
        outside: 'invisible',
        hidden: 'invisible',
      }}
    />
  )
}
