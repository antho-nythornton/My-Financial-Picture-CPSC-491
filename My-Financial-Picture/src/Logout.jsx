import { useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export default function Logout() {
  const navigate = useNavigate()
  const { isAuthed, logout } = useAuth()

  if (!isAuthed) return null

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <button type="button" className="menu-item" onClick={handleLogout}>
      Log Out
    </button>
  )
}