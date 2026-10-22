import { CheckCircle2 } from 'lucide-react'

interface ReservedChipProps {
  label: string
  /** Verde cuando la reserva es de la persona de la conversación (o del propio usuario); ámbar si es de otra. */
  highlight: boolean
}

/** Estado "reservada" compacto para la cabecera del chat. */
export default function ReservedChip({ label, highlight }: ReservedChipProps) {
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${highlight ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-900'}`}
    >
      <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
      {label}
    </span>
  )
}
