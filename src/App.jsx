import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './hooks/useApp'
import Home        from './pages/Home'
import Onboarding  from './pages/Onboarding'
import CrearPerfil from './pages/CrearPerfil'
import Feed        from './pages/Feed'
import Matches     from './pages/Matches'
import Final       from './pages/Final'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* Contenedor centrado — en desktop se ve como celular, en móvil ocupa toda la pantalla */}
        <div className="relative h-full w-full max-w-md mx-auto overflow-hidden">
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/onboarding"   element={<Onboarding />} />
            <Route path="/crear-perfil" element={<CrearPerfil />} />
            <Route path="/feed"         element={<Feed />} />
            <Route path="/matches"      element={<Matches />} />
            <Route path="/final"        element={<Final />} />
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
