import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal, Pencil } from 'lucide-react'
export default function ServiceActions({
  name,
  onEdit,
}: {
  name: string
  onEdit: () => void
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const edit = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    edit.current?.focus()
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  return (
    <div
      ref={root}
      className="sa-card-actions"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation()
          setOpen(false)
          trigger.current?.focus()
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="sa-more-button"
        aria-label={'Opciones de ' + name}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal size={20} />
      </button>
      {open && (
        <div className="sa-actions-popover">
          <button
            ref={edit}
            type="button"
            onClick={() => {
              setOpen(false)
              trigger.current?.focus()
              onEdit()
            }}
          >
            <Pencil size={15} />
            Editar servicio
          </button>
        </div>
      )}
    </div>
  )
}
