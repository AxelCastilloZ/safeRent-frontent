/**
 * Clases de botón del módulo (Tailwind plano, con los colores de SafeRent).
 * Se aplican tanto a <button> como a <Link>.
 */
const base =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition focus-visible:ring-[3px] focus-visible:ring-secondary/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export const buttonStyles = {
  primary: `${base} h-9 bg-primary px-4 text-white hover:bg-primary/90`,
  primaryLarge: `${base} h-10 bg-primary px-6 text-white hover:bg-primary/90`,
  outline: `${base} h-8 border border-slate-200 bg-white px-3 shadow-xs hover:bg-slate-100`,
  ghost: `${base} h-8 px-3 hover:bg-slate-100`,
  ghostIcon: `${base} size-9 hover:bg-slate-100`,
}
