import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import api from '../utils/api'

export default function Profile() {
  const { user } = useAuth()
  const { dark } = useTheme()
  const [form, setForm] = useState({ bloodGroup: '', allergies: '', emergencyContact: '', age: '', height: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/profile').then(res => { if (res.data) setForm(f => ({...f, ...res.data})) })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/profile', form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const card = { background: dark ? '#1e1e2e' : 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
  const input = { display:'block', width:'100%', marginBottom:'1rem', padding:'0.75rem', borderRadius:'6px', border: dark ? '1px solid #444' : '1px solid #ddd', background: dark ? '#2a2a3e' : 'white', color: dark ? '#eee' : '#111', boxSizing:'border-box' }
  const label = { display:'block', fontSize:'0.85rem', color:'#888', marginBottom:'0.3rem' }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Profile</h2>
      <div style={{ ...card, marginBottom: '1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
        <div style={{ width:'60px', height:'60px', borderRadius:'50%', background:'#4361ee', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'1.5rem', fontWeight:'bold' }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <strong style={{ fontSize:'1.1rem' }}>{user?.name}</strong>
          <p style={{ color:'#888', margin:0, fontSize:'0.9rem' }}>{user?.email}</p>
        </div>
      </div>
      <div style={card}>
        <form onSubmit={handleSubmit}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={label}>Blood Group</label><input style={input} placeholder="e.g. A+" value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})} /></div>
            <div><label style={label}>Age</label><input style={input} type="number" placeholder="Years" value={form.age} onChange={e => setForm({...form, age: e.target.value})} /></div>
            <div><label style={label}>Height (cm)</label><input style={input} type="number" placeholder="cm" value={form.height} onChange={e => setForm({...form, height: e.target.value})} /></div>
            <div><label style={label}>Emergency Contact</label><input style={input} placeholder="Phone number" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} /></div>
          </div>
          <div><label style={label}>Allergies</label><input style={input} placeholder="e.g. Penicillin, Peanuts" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} /></div>
          <button style={{ padding:'0.75rem 2rem', background: saved ? '#4caf50' : '#4361ee', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', transition:'background 0.2s' }} type="submit">
            {saved ? '✓ Saved' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
