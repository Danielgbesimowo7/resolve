import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './state/auth'
import { StoreProvider } from './state/store'
import AppShell from './app/AppShell'
import Dashboard from './app/Dashboard'
import Conversations from './app/Conversations'
import ConversationDetail from './app/ConversationDetail'
import AiPerformance from './app/AiPerformance'
import Knowledge from './app/Knowledge'
import Customers from './app/Customers'
import Analytics from './app/Analytics'
import Settings from './app/Settings'
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
              <Route path="conversations/:id" element={<ConversationDetail />} />
              <Route path="ai-performance" element={<AiPerformance />} />
              <Route path="knowledge" element={<Knowledge />} />
              <Route path="customers" element={<Customers />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="teams" element={<Navigate to="/app/settings?tab=team" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </StoreProvider>
    </AuthProvider>
  )
}
