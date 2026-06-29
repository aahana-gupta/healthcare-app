import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  const inputStyle = {
    display: 'block', width: '100%', padding: '0.75rem 1rem',
    borderRadius: '8px', border: '1px solid var(--border-input)',
    background: 'var(--bg-input)', color: 'var(--text-primary)',
    fontSize: '0.95rem', outline: 'none', marginBottom: '1rem'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2.5rem', width: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#4361ee', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, marginBottom: '1.25rem' }}>HT</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Sign in to your account</p>
        </div>
        {error && <div style={{ background: '#fff0f0', border: '1px solid #ffd0d0', borderRadius: '8px', padding: '0.75rem 1rem', color: '#c0392b', fontSize: '0.88rem', marginBottom: '1rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>EMAIL</label>
          <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.03em' }}>PASSWORD</label>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <input style={{...inputStyle, marginBottom: 0, paddingRight: '3.5rem'}} type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 500 }}>{showPw ? 'Hide' : 'Show'}</button>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.8rem', background: '#4361ee', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>Don't have an account? <Link to="/register" style={{ color: '#4361ee', fontWeight: 500 }}>Register</Link></p>
      </div>
    </div>
  )
}
