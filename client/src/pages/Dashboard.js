import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../utils/api'

export default function Dashboard() {
  const { user } = useAuth()
  const { dark } = useTheme()
  const [data, setData] = useState({ appointments: [], medications: [], metrics: [], records: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [a, m, me, r] = await Promise.all([
          api.get('/appointments'),
          api.get('/medications'),
          api.get('/health-metrics?type=weight'),
          api.get('/medical-records')
        ])
        setData({ appointments: a.data, medications: m.data, metrics: me.data, records: r.data })
      } catch (err) {}
      setLoading(false)
    }
    fetchAll()
  }, [])

  const today = new Date()
  const upcoming = data.appointments.filter(a => new Date(a.date) >= today)
  const medsDue = data.medications.filter(m => !m.morning || !m.afternoon || !m.night)
  const lastWeight = data.metrics.length ? data.metrics[data.metrics.length - 1].value : null
  const chartData = data.metrics.slice(-10).map(m => ({ date: new Date(m.date).toLocaleDateString(), weight: m.value }))

  const card = { background: dark ? '#1e1e2e' : 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
  const statCard = { ...card, textAlign: 'center' }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      {upcoming.length > 0 && (
        <div style={{ background: '#4361ee', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          📅 You have {upcoming.length} upcoming appointment{upcoming.length > 1 ? 's' : ''}
          {medsDue.length > 0 && ` · 💊 ${medsDue.length} medication${medsDue.length > 1 ? 's' : ''} pending today`}
        </div>
      )}

      <h2 style={{ marginBottom: '0.5rem' }}>Welcome back, {user?.name}</h2>
      <p style={{ color: '#888', marginBottom: '2rem' }}>{today.toDateString()}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/appointments" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={statCard}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4361ee' }}>{upcoming.length}</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Upcoming Appointments</div>
          </div>
        </Link>
        <Link to="/medications" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={statCard}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💊</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7209b7' }}>{medsDue.length}</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Medicines Due</div>
          </div>
        </Link>
        <Link to="/metrics" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={statCard}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚖️</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3a0ca3' }}>{lastWeight ?? '—'}</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Last Weight (kg)</div>
          </div>
        </Link>
        <Link to="/records" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={statCard}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f72585' }}>{data.records.length}</div>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>Medical Records</div>
          </div>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={card}>
          <h3 style={{ marginBottom: '1rem' }}>Weight Trend</h3>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#4361ee" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: '#888', fontSize: '0.9rem' }}>No weight data yet. <Link to="/metrics">Add entries →</Link></p>
          )}
        </div>

        <div style={card}>
          <h3 style={{ marginBottom: '1rem' }}>Upcoming Appointments</h3>
          {upcoming.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.9rem' }}>No upcoming appointments. <Link to="/appointments">Schedule one →</Link></p>
          ) : (
            upcoming.slice(0, 4).map(a => (
              <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: dark ? '1px solid #333' : '1px solid #f0f0f0' }}>
                <span>{a.doctor}</span>
                <span style={{ color: '#888', fontSize: '0.9rem' }}>{new Date(a.date).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
