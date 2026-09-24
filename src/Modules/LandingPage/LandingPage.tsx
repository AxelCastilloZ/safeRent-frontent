import BenefitsSection from './Components/BenefitsSection'
import FeaturedProperties from './Components/FeaturedProperties'
import Footer from './Components/Footer'
import HeroSection from './Components/HeroSection'
import HowItWorks from './Components/HowItWorks'
import Navbar from './Components/Navbar'
import OwnerCTA from './Components/OwnerCTA'
import PropertySearchBar from './Components/PropertySearchBar'
import QuickFilters from './Components/QuickFilters'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main>
        <HeroSection />
        <PropertySearchBar />
        <QuickFilters />
        <FeaturedProperties />
        <BenefitsSection />
        <HowItWorks />
        <OwnerCTA />
      </main>
      <Footer />
    </div>
  )
}
