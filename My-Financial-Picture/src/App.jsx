import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Login from './Login';
import Started from './Started';
import Dashboard from './Dashboard';
import Reset_password from './Reset_password';
import { useAuth } from './context/AuthContext';

function RequireAuth() {
  const { isAuthed } = useAuth();
  return isAuthed ? <Outlet /> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        {/* Landing = Login */}
        <Route path="/" element={<Login />} />
        <Route path="/started" element={<Started />} />
        {/* Keep the route lower-case to match your Links */}
        <Route path="/reset_password" element={<Reset_password />} />

        {/* Protected area */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}