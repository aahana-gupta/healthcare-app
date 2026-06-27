import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api from '../utils/api'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { dark } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  const bg = dark ? '#0f0f1a' : '#f8f9fc'
  const cardBg = dark ? '#1a1a2e' : '#ffffff'
  const border = dark ? '1px solid #2a2a3e' : '1px solid #eef0f5'
  const textColor = dark ? '#eee' : '#1a1a2e'
  const inputStyle = { display: 'block', width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border, background: dark ? '#12121f' : '#f8f9fc', color: textColor, fontSize: '0.95rem', outline: 'none', marginBottom: '1rem' }
  const labelStyle = { display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#888', marginBottom: '0.4rem', letterSpacing: '0.03em' }

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: cardBg, border, borderRadius: '16px', padding: '2.5rem', width: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#4361ee', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, marginBottom: '1.25rem' }}>HT</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: textColor }}>Create account</h2>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.25rem' }}>Start tracking your health today</p>
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0', borderRadius: '8px', padding: '0.75rem 1rem', color: '#c0392b', fontSize: '0.88rem', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>FULL NAME</label>
          <input style={inputStyle} placeholder="Aahana Gupta" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <label style={labelStyle}>EMAIL</label>
          <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <label style={labelStyle}>PASSWORD</label>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <input style={{...inputStyle, marginBottom: 0, paddingRight: '3.5rem'}} type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '0.82rem', fontWeight: 500 }}>{showPw ? 'Hide' : 'Show'}</button>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.8rem', background: '#4361ee', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: '#888' }}>Already have an account? <Link to="/login" style={{ color: '#4361ee', fontWeight: 500 }}>Sign in</Link></p>
      </div>
    </div>
  )
}
