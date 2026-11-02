import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'

/** Ojito con cuántas personas han abierto la propiedad. Es solo información (sin borde ni efecto al pasar el mouse) para no confundirse con un botón. */
export default function ViewsBadge({ count }: { count: number }) {
  useTranslation()
  return (
    <span title={i18n.t('property:viewsTitle')} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-primary">
      <Eye size={16} aria-hidden="true" />
      {i18n.t('property:viewsCount', { count })}
    </span>
  )
}
