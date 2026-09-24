import { Outlet } from 'react-router-dom'
import Navbar from '../../LandingPage/Components/Navbar'
import OwnerSidebar from './OwnerSidebar'

export default function OwnerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <div className="flex flex-1 max-md:flex-col">
        <OwnerSidebar />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
