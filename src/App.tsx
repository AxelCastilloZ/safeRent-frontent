import { Navigate, Route, Routes } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'
import LandingPage from './Modules/LandingPage/LandingPage'
import ExplorePage from './Modules/Explore/ExplorePage'
import AboutPage from './Modules/About/AboutPage'
import SupportPage from './Modules/Support/SupportPage'
import PrivacyPolicyPage from './Modules/Legal/PrivacyPolicyPage'
import TermsOfServicePage from './Modules/Legal/TermsOfServicePage'
import OwnerLayout from './Modules/Property/Components/OwnerLayout'
import PropertyPage from './Modules/Property/PropertyPage'
import CreatePropertyStep1Page from './Modules/Property/CreatePropertyStep1Page'
import CreatePropertyStep2Page from './Modules/Property/CreatePropertyStep2Page'
import PropertyDetailPage from './Modules/Property/PropertyDetailPage'
import PropertyPublishedPage from './Modules/Property/PropertyPublishedPage'

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

        {/* Property module – owner area */}
        <Route path="/propietario" element={<OwnerLayout />}>
          <Route index element={<Navigate to="propiedades" replace />} />
          <Route path="propiedades" element={<PropertyPage />} />
          <Route path="propiedades/nueva" element={<CreatePropertyStep1Page />} />
          <Route path="propiedades/nueva/media" element={<CreatePropertyStep2Page />} />
          <Route path="propiedades/:id" element={<PropertyDetailPage />} />
          <Route path="propiedades/:id/publicada" element={<PropertyPublishedPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
