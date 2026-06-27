import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../utils/api'

export default function HealthMetrics() {
  const [metrics, setMetrics] = useState([])
  const [type, setType] = useState('weight')
  const [form, setForm] = useState({ type: 'weight', value: '', date: '' })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchMetrics() }, [type])

  const fetchMetrics = async () => {
    const res = await api.get(`/health-metrics?type=${type}`)
    setMetrics(res.data)
  }

  const validate = () => {
    const v = parseFloat(form.value)
    if (form.type === 'weight' && (v < 20 || v > 300)) return 'Weight must be between 20–300 kg'
    if (form.type === 'sleep' && (v < 0 || v > 24)) return 'Sleep must be between 0–24 hours'
    if (form.type === 'bloodPressure' && (v < 60 || v > 250)) return 'Systolic BP must be between 60–250'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const error = validate()
    if (error) return alert(error)
    await api.post('/health-metrics', form)
    setForm({ type, value: '', date: '' })
    setShowForm(false)
    fetchMetrics()
  }

  const chartData = metrics.map(m => ({
    date: new Date(m.date).toLocaleDateString(),
    value: m.value
  }))

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Health Metrics</h2>
        <button style={styles.btn} onClick={() => setShowForm(!showForm)}>+ Add</button>
      </div>
      <div style={styles.tabs}>
        {['weight', 'sleep', 'bloodPressure'].map(t => (
          <button key={t} style={{...styles.tab, background: type === t ? '#1a1a2e' : 'white', color: type === t ? 'white' : '#333'}} onClick={() => setType(t)}>
            {t === 'bloodPressure' ? 'Blood Pressure' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <select style={styles.input} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="weight">Weight (kg)</option>
            <option value="sleep">Sleep (hours)</option>
            <option value="bloodPressure">Blood Pressure</option>
          </select>
          <input style={styles.input} type="number" placeholder="Value" min={form.type === 'weight' ? 20 : form.type === 'sleep' ? 0 : 60} max={form.type === 'weight' ? 300 : form.type === 'sleep' ? 24 : 250} value={form.value} onChange={e => setForm({...form, value: e.target.value})} required />
          <input style={styles.input} type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          <button style={styles.btn} type="submit">Save</button>
        </form>
      )}
      {chartData.length > 0 && (
        <div style={styles.chart}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4361ee" strokeWidth={2} dot={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {metrics.map(m => (
        <div key={m._id} style={styles.card}>
          <span>{new Date(m.date).toLocaleDateString()}</span>
          <strong>{m.value} {type === 'weight' ? 'kg' : type === 'sleep' ? 'hrs' : ''}</strong>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  tabs: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' },
  tab: { padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  form: { background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' },
  input: { display: 'block', width: '100%', marginBottom: '1rem', padding: '0.7rem', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' },
  btn: { padding: '0.6rem 1.2rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  chart: { background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  card: { display: 'flex', justifyContent: 'space-between', background: 'white', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '0.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
}
