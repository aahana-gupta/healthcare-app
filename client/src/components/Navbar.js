import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 2rem', background: dark ? '#1a1a2e' : '#1a1a2e', color:'white', position:'sticky', top:0, zIndex:100 }}>
      <Link to="/" style={{ color:'white', textDecoration:'none', fontWeight:'bold', fontSize:'1.2rem' }}>⚕ HealthTrack</Link>
      {user && (
        <div style={{ display:'flex', gap:'1.2rem', alignItems:'center' }}>
          <Link to="/" style={navLink}>Dashboard</Link>
          <Link to="/appointments" style={navLink}>Appointments</Link>
          <Link to="/medications" style={navLink}>Medications</Link>
          <Link to="/metrics" style={navLink}>Metrics</Link>
          <Link to="/records" style={navLink}>Records</Link>
          <Link to="/profile" style={navLink}>Profile</Link>
          <button onClick={toggle} style={iconBtn}>{dark ? '☀️' : '🌙'}</button>
          <button onClick={handleLogout} style={logoutBtn}>Logout</button>
        </div>
      )}
    </nav>
  )
}

const navLink = { color:'#ccc', textDecoration:'none', fontSize:'0.9rem' }
const iconBtn = { background:'transparent', border:'none', cursor:'pointer', fontSize:'1.1rem' }
const logoutBtn = { background:'transparent', border:'1px solid #ccc', color:'#ccc', padding:'0.35rem 0.9rem', cursor:'pointer', borderRadius:'4px', fontSize:'0.9rem' }
