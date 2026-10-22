import ConfirmDialog from '../../Dashboard/Components/ConfirmDialog'

interface UnsavedChangesDialogProps {
  /** `status` del bloqueador de `useUnsavedChangesWarning`. */
  blocked: boolean
  onLeave: () => void
  onStay: () => void
}

/** "¿Salir sin guardar?": aparece cuando se intenta salir del formulario con cambios pendientes. */
export default function UnsavedChangesDialog({ blocked, onLeave, onStay }: UnsavedChangesDialogProps) {
  if (!blocked) return null
  return (
    <ConfirmDialog
      title="¿Salir sin guardar?"
      description="Tienes cambios que todavía no se han guardado. Si sales ahora, se perderán."
      confirmLabel="Salir sin guardar"
      cancelLabel="Seguir editando"
      danger
      onConfirm={onLeave}
      onCancel={onStay}
    />
  )
}
