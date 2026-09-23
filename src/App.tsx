import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import LandingPage from './Modules/LandingPage/LandingPage'
import ExplorePage from './Modules/Explore/ExplorePage'
import AboutPage from './Modules/About/AboutPage'
import SupportPage from './Modules/Support/SupportPage'
import PrivacyPolicyPage from './Modules/Legal/PrivacyPolicyPage'
import TermsOfServicePage from './Modules/Legal/TermsOfServicePage'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explorar" element={<ExplorePage />} />
        <Route path="/sobre-nosotros" element={<AboutPage />} />
        <Route path="/soporte" element={<SupportPage />} />
        <Route path="/politica-de-privacidad" element={<PrivacyPolicyPage />} />
        <Route path="/terminos-del-servicio" element={<TermsOfServicePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
