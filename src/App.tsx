import LandingPage from './Modules/LandingPage/LandingPage'
import ExplorePage from './Modules/Explore/ExplorePage'

function App() {
  return window.location.pathname.replace(/\/$/, '') === '/explorar' ? <ExplorePage /> : <LandingPage />
}

export default App
