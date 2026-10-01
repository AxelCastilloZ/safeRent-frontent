import { createElement } from 'react'
import { resolveServiceIcon } from '../icons/serviceIcons'

export default function ServiceIcon({
  name,
  size = 20,
  className,
}: {
  name?: string | null
  size?: number
  className?: string
}) {
  return createElement(resolveServiceIcon(name), {
    size,
    className,
    'aria-hidden': true,
  })
}
