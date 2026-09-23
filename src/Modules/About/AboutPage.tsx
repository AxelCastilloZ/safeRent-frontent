import Navbar from '../LandingPage/Components/Navbar'
import Footer from '../LandingPage/Components/Footer'
import AboutHero from './Components/AboutHero'
import MissionSection from './Components/MissionSection'
import ProblemsSection from './Components/ProblemsSection'
import HowSafeRentHelpsSection from './Components/HowSafeRentHelpsSection'
import ValuesSection from './Components/ValuesSection'
import AboutCta from './Components/AboutCta'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main>
        <AboutHero />
        <MissionSection />
        <ProblemsSection />
        <HowSafeRentHelpsSection />
        <ValuesSection />
        <AboutCta />
      </main>
      <Footer />
    </div>
  )
}
