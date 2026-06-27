import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../utils/api'

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [form, setForm] = useState({ doctor: '', date: '', reason: '', notes: '' })
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const { dark } = useTheme()

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    const res = await api.get('/appointments')
    setAppointments(res.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/appointments', form)
    setForm({ doctor: '', date: '', reason: '', notes: '' })
    setShowForm(false)
    fetchAppointments()
  }

  const handleDelete = async (id) => {
    await api.delete(`/appointments/${id}`)
    fetchAppointments()
  }

  const filtered = appointments.filter(a =>
    a.doctor.toLowerCase().includes(search.toLowerCase()) ||
    (a.reason && a.reason.toLowerCase().includes(search.toLowerCase()))
  )

  const card = { background: dark ? '#1e1e2e' : 'white', padding:'1.2rem 1.5rem', borderRadius:'10px', marginBottom:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }
  const input = { display:'block', width:'100%', marginBottom:'1rem', padding:'0.75rem', borderRadius:'6px', border: dark ? '1px solid #444' : '1px solid #ddd', background: dark ? '#2a2a3e' : 'white', color: dark ? '#eee' : '#111', boxSizing:'border-box' }

  return (
    <div style={{ padding:'2rem', maxWidth:'800px', margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h2>Appointments</h2>
        <button style={btn} onClick={() => setShowForm(!showForm)}>+ Add</button>
      </div>

      <input style={{...input, marginBottom:'1.5rem'}} placeholder="🔍 Search appointments..." value={search} onChange={e => setSearch(e.target.value)} />

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: dark ? '#1e1e2e' : 'white', padding:'1.5rem', borderRadius:'10px', marginBottom:'1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
          <input style={input} placeholder="Doctor name" value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} required />
          <input style={input} type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
          <input style={input} placeholder="Reason" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} />
          <input style={input} placeholder="Notes" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          <button style={btn} type="submit">Save</button>
        </form>
      )}

      {filtered.length === 0 && <p style={{ color:'#888' }}>No appointments found.</p>}

      {filtered.map(a => (
        <div key={a._id} style={card}>
          <div>
            <strong>{a.doctor}</strong>
            <p style={{ color:'#888', margin:'0.3rem 0 0', fontSize:'0.9rem' }}>{new Date(a.date).toLocaleDateString()} · {a.reason}</p>
            {a.notes && <p style={{ color:'#aaa', fontSize:'0.85rem', margin:'0.2rem 0 0' }}>{a.notes}</p>}
          </div>
          <button style={{ background:'transparent', border:'1px solid #ff4444', color:'#ff4444', padding:'0.35rem 0.8rem', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem' }} onClick={() => handleDelete(a._id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

const btn = { padding:'0.6rem 1.2rem', background:'#4361ee', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' }
