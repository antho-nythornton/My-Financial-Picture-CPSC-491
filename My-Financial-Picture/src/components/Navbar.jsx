import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logout from '../Logout'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { isAuthed, email } = useAuth()

  useEffect(() => {
    const onDocClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false) }
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => { document.removeEventListener('mousedown', onDocClick); document.removeEventListener('keydown', onEsc) }
  }, [])

  return (
    <nav className="navbar">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <div className="navbar-left"><h2>Finance Tracker</h2></div>

      <ul className="nav-links">
        <li><NavLink to="/dashboard">Home</NavLink></li>
        <li><NavLink to="/reports">Reports</NavLink></li>
        <li><NavLink to="/budgets">Budgets</NavLink></li>
        <li><NavLink to="/accounts">Accounts</NavLink></li>
        <li><NavLink to="/bills">Bills</NavLink></li>
        <li><NavLink to="/planner">Planner</NavLink></li>
      </ul>

      <div className="navbar-right" ref={menuRef}>
        <button className="icon-btn" aria-label="Notifications" onClick={() => navigate('/notifications')} style={{ color: '#ffffff', backgroundColor: '#000000ff', borderRadius: '10px', alignItems: 'middle' }}><i className="material-icons">notifications</i></button>
        <button className="icon-btn" aria-label="Settings" onClick={() => navigate('/settings') }>
          <i className="material-icons" style={{ color: '#ffffff', backgroundColor: '#000000ff', borderRadius: '15px', verticalAlign: 'middle' }}>settings</i>
        </button>

        <div className="account-wrapper">
          <button className="icon-btn" aria-haspopup="menu" aria-expanded={open} aria-controls="account-menu" onClick={() => setOpen(v => !v)}>
            <i className="material-icons" style={{ color: '#ffffff', backgroundColor: '#000000ff', borderRadius: '15px', verticalAlign: 'middle' }}>account_circle</i>
          </button>

          {open && (
            <div id="account-menu" role="menu" className="account-menu">
              {isAuthed ? (
                <>
                  <div className="menu-header">Signed in{email ? ` as ${email}` : ''}</div>
                  <button type="button" role="menuitem" className="menu-item" onClick={() => { setOpen(false); navigate('/profile') }}>
                    <i className="material-icons">person</i> Profile
                  </button>
                  <button type="button" role="menuitem" className="menu-item" onClick={() => { setOpen(false); navigate('/settings') }}>
                    <i className="material-icons">settings</i> Settings
                  </button>
                  <div className="menu-divider" />
                  <Logout />
                </>
              ) : (
                <>
                  <div className="menu-header">Not signed in</div>
                  <Link to="/" role="menuitem" className="menu-item as-link" onClick={() => setOpen(false)}>
                    <i className="material-icons">login</i> Sign in
                  </Link>
                  <Link to="/started" role="menuitem" className="menu-item as-link" onClick={() => setOpen(false)}>
                    <i className="material-icons">person_add</i> Create account
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}