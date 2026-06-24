import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import api from '../utils/api'

const CATEGORIES = ['All', 'Blood Tests', 'Prescriptions', 'Scans', 'Vaccinations', 'Other']

export default function MedicalRecords() {
  const [records, setRecords] = useState([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Other')
  const [file, setFile] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const { dark } = useTheme()

  useEffect(() => { fetchRecords() }, [])

  const fetchRecords = async () => {
    const res = await api.get('/medical-records')
    setRecords(res.data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', category)
    formData.append('file', file)
    await api.post('/medical-records', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    setTitle(''); setFile(null); setShowForm(false)
    fetchRecords()
  }

  const handleDelete = async (id) => {
    await api.delete(`/medical-records/${id}`)
    fetchRecords()
  }

  const filtered = records
    .filter(r => filter === 'All' || r.category === filter)
    .filter(r => r.title.toLowerCase().includes(search.toLowerCase()))

  const card = { background: dark ? '#1e1e2e' : 'white', padding: '1rem 1.5rem', borderRadius: '10px', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }
  const input = { display:'block', width:'100%', marginBottom:'1rem', padding:'0.75rem', borderRadius:'6px', border: dark ? '1px solid #444' : '1px solid #ddd', background: dark ? '#2a2a3e' : 'white', color: dark ? '#eee' : '#111', boxSizing:'border-box' }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h2>Medical Records</h2>
        <button style={btn} onClick={() => setShowForm(!showForm)}>+ Upload</button>
      </div>

      <input style={{...input, marginBottom:'1rem'}} placeholder="🔍 Search records..." value={search} onChange={e => setSearch(e.target.value)} />

      <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding:'0.4rem 1rem', borderRadius:'20px', border:'none', cursor:'pointer', fontSize:'0.85rem', background: filter === c ? '#4361ee' : dark ? '#2a2a3e' : '#f0f0f0', color: filter === c ? 'white' : dark ? '#aaa' : '#555' }}>
            {c}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: dark ? '#1e1e2e' : 'white', padding:'1.5rem', borderRadius:'10px', marginBottom:'1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
          <input style={input} placeholder="Record title" value={title} onChange={e => setTitle(e.target.value)} required />
          <select style={input} value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
          </select>
          <input style={input} type="file" accept=".pdf,image/*" onChange={e => setFile(e.target.files[0])} required />
          <button style={btn} type="submit">Upload</button>
        </form>
      )}

      {filtered.length === 0 && <p style={{ color:'#888' }}>No records found.</p>}

      {filtered.map(r => (
        <div key={r._id} style={card}>
          <div>
            <strong>{r.title}</strong>
            <p style={{ color:'#888', margin:'0.2rem 0 0', fontSize:'0.85rem' }}>
              {r.category || 'Other'} · {r.filename} · {new Date(r.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button style={{ background:'transparent', border:'1px solid #ff4444', color:'#ff4444', padding:'0.35rem 0.8rem', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem' }} onClick={() => handleDelete(r._id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

const btn = { padding:'0.6rem 1.2rem', background:'#4361ee', color:'white', border:'none', borderRadius:'6px', cursor:'pointer' }
