import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 2.5rem', height: '64px',
      background: 'var(--bg-nav)',
      borderBottom: '1px solid var(--border-nav)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: 'var(--shadow-nav)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
        <span style={{ background: '#4361ee', color: 'white', borderRadius: '8px', padding: '4px 8px', fontSize: '0.85rem' }}>HT</span>
        HealthTrack
      </Link>
      {user && (
        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {[['/', 'Dashboard'], ['/appointments', 'Appointments'], ['/medications', 'Medications'], ['/metrics', 'Metrics'], ['/records', 'Records'], ['/profile', 'Profile']].map(([path, label]) => (
            <Link key={path} to={path} style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 450, transition: 'all 0.15s' }}
              onMouseEnter={e => e.target.style.background = 'var(--bg-hover)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}>{label}</Link>
          ))}
          <button onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', fontSize: '1rem', marginLeft: '0.5rem' }}>{dark ? '☀️' : '🌙'}</button>
          <button onClick={handleLogout} style={{ marginLeft: '0.5rem', padding: '0.4rem 1rem', background: '#4361ee', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 500 }}>Logout</button>
        </div>
      )}
    </nav>
  )
}
