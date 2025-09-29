import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import About from './About'
import Navigation from './Navigation'
import Started from './Started'
import Reset_password from './Reset_password'

function App() {
  return (
    <>
    <Navigation />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/started" element={<Started />} />
      <Route path="/Reset_password" element={<Reset_password />} />
    </Routes>
    </>
  )
}

export default App
