// src/App.jsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from './Login'
import Started from './Started'
import Reset_password from './Reset_password'
import Dashboard from './Dashboard'
import Reports from './pages/Reports'
import Budgets from './pages/Budgets'
import Accounts from './pages/Accounts'
import Bills from './pages/Bills'
import Planner from './pages/Planner'
import AppLayout from './layouts/AppLayout'
import { useAuth } from './context/AuthContext'

function RequireAuth() {
  const { isAuthed } = useAuth()
  return isAuthed ? <Outlet /> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/" element={<Login />} />
      <Route path="/started" element={<Started />} />
      <Route path="/reset_password" element={<Reset_password />} />

      {/* protected */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/planner" element={<Planner />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}