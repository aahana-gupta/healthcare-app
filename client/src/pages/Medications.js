import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../utils/api'

export default function Medications() {
  const [meds, setMeds] = useState([])
  const [form, setForm] = useState({ name: '', dosage: '', frequency: '' })
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const { dark } = useTheme()

  useEffect(() => { fetchMeds() }, [])

  const fetchMeds = async () => {
    const res = await api.get('/medications')
    setMeds(res.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/medications', form)
    setForm({ name: '', dosage: '', frequency: '' })
    setShowForm(false)
    fetchMeds()
  }

  const toggleTime = async (id, field, current) => {
    await api.patch(`/medications/${id}`, { [field]: !current })
    fetchMeds()
  }

  const handleDelete = async (id) => {
    await api.delete(`/medications/${id}`)
    fetchMeds()
  }

  const filtered = meds.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))

  const card = { background: dark ? '#1e1e2e' : 'white', padding: '1.2rem 1.5rem', borderRadius: '10px', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }
  const input = { display:'block', width:'100%', marginBottom:'1rem', padding:'0.75rem', borderRadius:'6px', border: dark ? '1px solid #444' : '1px solid #ddd', background: dark ? '#2a2a3e' : 'white', color: dark ? '#eee' : '#111', boxSizing:'border-box' }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h2>Medications</h2>
        <button style={btn} onClick={() => setShowForm(!showForm)}>+ Add</button>
      </div>

      <input style={{...input, marginBottom:'1.5rem'}} placeholder="🔍 Search medications..." value={search} onChange={e => setSearch(e.target.value)} />

      {showForm && (
        <form onSubmit={handleSubmit} style={{ ...card, marginBottom: '1.5rem' }}>
          <input style={input} placeholder="Medicine name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required maxLength={100} />
          <input style={input} placeholder="Dosage (e.g. 500mg)" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} maxLength={50} />
          <input style={input} placeholder="Frequency (e.g. twice daily)" value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})} maxLength={50} />
          <button style={btn} type="submit">Save</button>
        </form>
      )}

      {filtered.length === 0 && <p style={{ color: '#888' }}>No medications found.</p>}

      {filtered.map(m => (
        <div key={m._id} style={card}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <strong style={{ fontSize: '1.05rem' }}>{m.name}</strong>
              <p style={{ color:'#888', margin:'0.2rem 0 0.8rem', fontSize:'0.9rem' }}>{m.dosage} · {m.frequency}</p>
            </div>
            <button style={{ background:'transparent', border:'1px solid #ff4444', color:'#ff4444', padding:'0.3rem 0.7rem', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem' }} onClick={() => handleDelete(m._id)}>Delete</button>
          </div>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            {['morning', 'afternoon', 'night'].map(time => (
              <button key={time} onClick={() => toggleTime(m._id, time, m[time])} style={{ padding:'0.4rem 1rem', borderRadius:'20px', border:'none', cursor:'pointer', fontSize:'0.85rem', background: m[time] ? '#4361ee' : dark ? '#2a2a3e' : '#f0f0f0', color: m[time] ? 'white' : dark ? '#aaa' : '#555', transition:'all 0.15s' }}>
                {time === 'morning' ? '🌅 Morning' : time === 'afternoon' ? '☀️ Afternoon' : '🌙 Night'}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const btn = { padding:'0.6rem 1.2rem', background:'#4361ee', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' }
