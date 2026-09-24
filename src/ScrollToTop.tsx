import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router doesn't reset scroll position between route changes the way a
 * full page load does, so navigating (e.g. from the Footer) can land the new
 * page scrolled to wherever the previous one was left. This restores that
 * behavior globally: on every pathname change, jump to the top instantly.
 *
 * Only `pathname` is watched (not the full location), so same-page hash
 * navigation — e.g. "#how-it-works" from the Navbar — keeps scrolling to the
 * anchor instead of being reset to the top.
 *
 * Mount once near the router root (see App.tsx); it renders nothing.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
