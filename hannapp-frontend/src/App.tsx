import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './index.css'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import TermsPage from './pages/TermsPage'
import ImageGridTestPage from './pages/ImageGridTestPage'
import TetrisPage from './pages/Tetris'

const LegacyRedirect: React.FC<{ to: string }> = ({ to }) => {
  const location = useLocation();
  return <Navigate to={`${to}${location.search}`} replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Legacy file redirects (from vanilla JS location.assign/href changes) */}
        <Route path="/login-page.html" element={<LegacyRedirect to="/login" />} />
        <Route path="/home-page.html" element={<LegacyRedirect to="/home" />} />
        <Route path="/profile.html" element={<LegacyRedirect to="/profile" />} />
        <Route path="/settings.html" element={<LegacyRedirect to="/settings" />} />

        {/* App Pages */}
        <Route path="/home"     element={<HomePage />} />
        <Route path="/profile"  element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/terms"    element={<TermsPage />} />

        {/* Dev / Test */}
        <Route path="/image-grid-test" element={<ImageGridTestPage />} />

        {/* Games */}
        <Route path="/games/tetris"    element={<TetrisPage />} />

        {/* Catch-all → Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
