import { useBlocker } from '@tanstack/react-router'
import { useRef } from 'react'

/**
 * Avisa antes de abandonar el formulario con cambios sin guardar (otra pantalla del panel, atrás del
 * navegador, cerrar o recargar la pestaña). `allowLeaving` se llama justo antes de navegar a propósito
 * (después de guardar), para que esa salida no pregunte.
 */
export function useUnsavedChangesWarning(dirty: boolean) {
  const allowed = useRef(false)
  const blocker = useBlocker({
    shouldBlockFn: () => dirty && !allowed.current,
    enableBeforeUnload: () => dirty && !allowed.current,
    withResolver: true,
  })
  return { blocker, allowLeaving: () => { allowed.current = true } }
}
