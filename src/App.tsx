import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './state/auth'
import { StoreProvider } from './state/store'
import AppShell from './app/AppShell'
import Dashboard from './app/Dashboard'
import Conversations from './app/Conversations'
import ComingSoon from './app/ComingSoon'
import Login from './pages/Login'
import './app/app.css'

const Landing = lazy(() => import('./landing/Landing'))

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user } = useAuth(), loc = useLocation()
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname }} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/app" element={<RequireAuth><AppShell /></RequireAuth>}>
              <Route index element={<Dashboard />} />
              <Route path="conversations" element={<Conversations />} />
              {['ai-performance', 'knowledge', 'customers', 'analytics', 'teams', 'settings'].map(p => <Route key={p} path={p} element={<ComingSoon />} />)}
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </StoreProvider>
    </AuthProvider>
  )
}
