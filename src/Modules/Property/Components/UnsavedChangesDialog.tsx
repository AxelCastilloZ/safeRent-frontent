import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import ConfirmDialog from '../../Dashboard/Components/ConfirmDialog'

interface UnsavedChangesDialogProps {
  /** `status` del bloqueador de `useUnsavedChangesWarning`. */
  blocked: boolean
  onLeave: () => void
  onStay: () => void
}

/** "¿Salir sin guardar?": aparece cuando se intenta salir del formulario con cambios pendientes. */
export default function UnsavedChangesDialog({ blocked, onLeave, onStay }: UnsavedChangesDialogProps) {
  useTranslation()
  if (!blocked) return null
  return (
    <ConfirmDialog
      title={i18n.t("property:leaveUnsavedTitle")}
      description={i18n.t("property:leaveUnsavedDescription")}
      confirmLabel={i18n.t("property:leaveUnsaved")}
      cancelLabel={i18n.t("property:keepEditing")}
      danger
      onConfirm={onLeave}
      onCancel={onStay}
    />
  )
}
