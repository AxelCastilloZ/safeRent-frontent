import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import type { ComponentProps } from 'react'

// Select al estilo shadcn/ui (sobre Radix), con los colores de SafeRent. Sustituye al <select> nativo:
// abre una lista con la opción elegida marcada, grupos, teclado completo y búsqueda al escribir.

const cx = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ')

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

/** `field`: campo completo con borde. `inline`: pieza izquierda de un campo compuesto (p. ej. moneda + precio). */
const TRIGGER_VARIANTS = {
  field: 'w-full rounded-xl border border-slate-300 bg-white hover:border-slate-400 data-[state=open]:border-teal-700',
  inline: 'w-auto shrink-0 rounded-l-xl border-r border-slate-200 bg-slate-50 hover:bg-slate-100',
}

export function SelectTrigger({ className, children, variant = 'field', ...props }: ComponentProps<typeof SelectPrimitive.Trigger> & { variant?: keyof typeof TRIGGER_VARIANTS }) {
  return (
    <SelectPrimitive.Trigger
      className={cx(
        'flex min-h-12 items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm text-primary transition',
        'data-[placeholder]:text-slate-500 aria-[invalid=true]:border-red-500 disabled:cursor-not-allowed disabled:opacity-50',
        TRIGGER_VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown size={16} className="shrink-0 text-slate-500" aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export function SelectContent({ className, children, position = 'popper', ...props }: ComponentProps<typeof SelectPrimitive.Content>) {
  const scrollButton = 'flex h-7 cursor-default items-center justify-center text-slate-500'
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={6}
        collisionPadding={12}
        className={cx(
          'z-50 max-h-[min(var(--radix-select-content-available-height),22rem)] min-w-[max(var(--radix-select-trigger-width),14rem)] overflow-hidden rounded-xl border border-slate-200 bg-white text-primary shadow-lg',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className={scrollButton}>
          <ChevronUp size={16} aria-hidden="true" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className={scrollButton}>
          <ChevronDown size={16} aria-hidden="true" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

export function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return <SelectPrimitive.Label className={cx('px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500', className)} {...props} />
}

export function SelectSeparator({ className, ...props }: ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className={cx('-mx-1.5 my-1.5 h-px bg-slate-100', className)} {...props} />
}

/**
 * Opción de la lista. `children` es lo que se muestra también en el campo al elegirla;
 * `description` (opcional) queda solo en la lista, bajo el texto principal.
 */
export function SelectItem({ className, children, description, ...props }: ComponentProps<typeof SelectPrimitive.Item> & { description?: string }) {
  return (
    <SelectPrimitive.Item
      className={cx(
        'relative flex cursor-default select-none flex-col justify-center rounded-lg py-2 pl-3 pr-9 text-sm outline-none',
        'data-[highlighted]:bg-slate-100 data-[state=checked]:font-semibold data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      {description && <span className="mt-0.5 text-xs font-normal text-slate-500">{description}</span>}
      <span className="absolute right-3 top-1/2 grid size-4 -translate-y-1/2 place-items-center">
        <SelectPrimitive.ItemIndicator>
          <Check size={16} className="text-teal-700" aria-hidden="true" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}
