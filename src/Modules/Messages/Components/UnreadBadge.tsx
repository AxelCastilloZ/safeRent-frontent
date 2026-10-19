/** Pastilla con la cantidad de mensajes sin leer. No muestra nada si no hay. */
export default function UnreadBadge({ count, className = '' }: { count: number; className?: string }) {
  if (count <= 0) return null

  return (
    <span
      className={`inline-flex min-w-5 shrink-0 items-center justify-center rounded-full bg-secondary-dark px-1.5 py-0.5 text-[11px] font-bold leading-none text-white ${className}`}
    >
      <span aria-hidden="true">{count > 99 ? '99+' : count}</span>
      <span className="sr-only">{count === 1 ? '1 mensaje sin leer' : `${count} mensajes sin leer`}</span>
    </span>
  )
}
