/** Etiqueta "Inquilino" / "Arrendatario" junto al nombre. */
export default function RoleBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide whitespace-nowrap text-slate-500">
      {children}
    </span>
  )
}
