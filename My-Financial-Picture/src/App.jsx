import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import About from './About'
import Navigation from './Navigation'
//import Started from './Started'

function App() {
  return (
    <>
    <Navigation />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      {/* <Route path="/Create Account" element={<Started />} /> */}
    </Routes>
    </>
  )
}

export default App
