// src/layouts/AppLayout.jsx
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function AppLayout() {
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}