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

  const card = { background: dark ? '#1e1e2e' : 'white', padding: '2.5rem', borderRadius: '12px', width: '380px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
  const input = { display:'block', width:'100%', marginBottom:'1rem', padding:'0.75rem', borderRadius:'6px', border: dark ? '1px solid #444' : '1px solid #ddd', background: dark ? '#2a2a3e' : 'white', color: dark ? '#eee' : '#111', boxSizing:'border-box', fontSize:'0.95rem' }

  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'90vh' }}>
      <div style={card}>
        <h2 style={{ marginBottom:'1.5rem' }}>Create account</h2>
        {error && <p style={{ color:'#ff4444', marginBottom:'1rem', fontSize:'0.9rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={input} placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <div style={{ position:'relative', marginBottom:'1rem' }}>
            <input style={{...input, marginBottom:0}} type={showPw ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#888', fontSize:'0.85rem' }}>
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
          <button style={{ width:'100%', padding:'0.75rem', background:'#4361ee', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'1rem', opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ marginTop:'1rem', fontSize:'0.9rem', textAlign:'center' }}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}
