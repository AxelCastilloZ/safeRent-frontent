import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const navigationItems = [
  { label: 'Explorar', href: '#properties' },
  { label: 'Cómo funciona', href: '#how-it-works' },
  { label: 'Para propietarios', href: '#owner-cta' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Navegación principal">
        <a href="#top" className="flex items-center gap-2 font-bold text-ink" aria-label="SafeRent, inicio" onClick={closeMenu}>
          <img src="/LogoSafeRentAzul.png" alt="" className="size-9 rounded-lg object-contain" />
          <span className="text-xl tracking-tight">SafeRent</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navigationItems.map((item, index) => <a key={item.href} href={item.href} className={`border-b-2 py-1 text-sm font-medium transition ${index === 0 ? 'border-secondary text-primary' : 'border-transparent text-neutral hover:border-secondary hover:text-primary'}`}>{item.label}</a>)}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button type="button" className="rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-slate-100">Iniciar sesión</button>
          <button type="button" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark">Registrarse</button>
        </div>
        <button type="button" className="rounded-lg p-2 text-ink hover:bg-slate-100 md:hidden" aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>
      {isOpen && <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-1">
          {navigationItems.map((item) => <a key={item.href} href={item.href} onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-medium text-primary hover:bg-slate-50">{item.label}</a>)}
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            <button type="button" className="rounded-lg px-3 py-2.5 text-sm font-semibold text-primary hover:bg-slate-100">Iniciar sesión</button>
            <button type="button" className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">Registrarse</button>
          </div>
        </div>
      </div>}
    </header>
  )
}
