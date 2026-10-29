import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import DisplayPreferences from '../../Auth/components/DisplayPreferences';
import AuthActions from '../../Auth/components/AuthActions'
import UserMenu from '../../Dashboard/Components/UserMenu'
import { useSessionToken } from '../../Auth/services/authSession'

type NavItem = { kind: 'route'; label: string; to: string } | { kind: 'anchor'; label: string; href: string }

export default function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false)
  const token = useSessionToken()
  const closeMenu = () => setIsOpen(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // "Cómo funciona" y "Para propietarios" son anclas dentro de la landing: si ya
  // estamos ahí, se mantienen como anclas puras (mismo comportamiento de siempre);
  // si no, apuntan a "/#..." para volver al inicio y hacer scroll — el mismo
  // patrón que ya usa el header de ExplorePage.
  const navigationItems: NavItem[] = [
    { kind: 'route', label: t("navigation:explore"), to: '/explorar' },
    { kind: 'anchor', label: t("navigation:howItWorks"), href: isHome ? '#how-it-works' : '/#how-it-works' },
    { kind: 'anchor', label: t("navigation:forOwners"), href: isHome ? '#owner-cta' : '/#owner-cta' },
  ]

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 py-1 text-sm font-medium transition ${isActive ? 'border-secondary text-primary' : 'border-transparent text-neutral hover:border-secondary hover:text-primary'}`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-2 px-3 py-3 sm:px-6" aria-label={t("navigation:main")}>
        {isHome ? (
          <a href="#top" className="flex shrink-0 items-center gap-2 font-bold text-ink" aria-label={t("navigation:brandHome")} onClick={closeMenu}>
            <img src="/LogoSafeRentAzul.png" alt="" className="size-9 rounded-lg object-contain" />
            <span className="hidden text-xl tracking-tight sm:inline">SafeRent</span>
          </a>
        ) : (
          <Link to="/" className="flex items-center gap-2 font-bold text-ink" aria-label={t("navigation:brandHome")} onClick={closeMenu}>
            <img src="/LogoSafeRentAzul.png" alt="" className="size-9 rounded-lg object-contain" />
            <span className="hidden text-xl tracking-tight sm:inline">SafeRent</span>
          </Link>
        )}

        <div className="hidden items-center gap-7 lg:flex">
          {navigationItems.map((item) =>
            item.kind === 'route' ? (
              <Link key={item.to} to={item.to} className={navLinkClassName({ isActive: pathname === item.to || pathname.startsWith(`${item.to}/`) })}>
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} className="border-b-2 border-transparent py-1 text-sm font-medium text-neutral transition hover:border-secondary hover:text-primary">
                {item.label}
              </a>
            ),
          )}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <DisplayPreferences />
          {token ? <UserMenu /> : <AuthActions />}
        </div>
        <div className="flex items-center gap-1 lg:hidden">
        <DisplayPreferences />
        {token && <UserMenu onAction={closeMenu} />}
        <button type="button" className="rounded-lg p-2 text-ink hover:bg-slate-100 lg:hidden" aria-label={isOpen ? t("navigation:closeMenu") : t("navigation:openMenu")} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        </div>
      </nav>
      {isOpen && <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg lg:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-1">
          {navigationItems.map((item) =>
            item.kind === 'route' ? (
              <Link key={item.to} to={item.to} onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-medium text-primary hover:bg-slate-50">
                {item.label}
              </Link>
            ) : (
              <a key={item.href} href={item.href} onClick={closeMenu} className="rounded-lg px-3 py-3 text-sm font-medium text-primary hover:bg-slate-50">
                {item.label}
              </a>
            ),
          )}
          {!token && <div className="mt-2 flex items-center justify-center gap-2 border-t border-slate-100 pt-3">
            <AuthActions onAction={closeMenu} />
          </div>}
        </div>
      </div>}
    </header>
  )
}
