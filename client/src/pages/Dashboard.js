import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
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
          api.get('/appointments'), api.get('/medications'),
          api.get('/health-metrics?type=weight'), api.get('/medical-records')
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

  const bg = dark ? '#0f0f1a' : '#f8f9fc'
  const cardBg = dark ? '#1a1a2e' : '#ffffff'
  const border = dark ? '1px solid #2a2a3e' : '1px solid #eef0f5'
  const textColor = dark ? '#eee' : '#1a1a2e'
  const mutedColor = dark ? '#888' : '#6b7280'

  const statCards = [
    { label: 'Upcoming Appointments', value: upcoming.length, color: '#4361ee', bg: '#eef1ff', icon: '📅', path: '/appointments' },
    { label: 'Medicines Due Today', value: medsDue.length, color: '#7209b7', bg: '#f3e8ff', icon: '💊', path: '/medications' },
    { label: 'Last Weight (kg)', value: lastWeight ?? '—', color: '#0891b2', bg: '#e0f7fa', icon: '⚖️', path: '/metrics' },
    { label: 'Medical Records', value: data.records.length, color: '#059669', bg: '#d1fae5', icon: '📄', path: '/records' },
  ]

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: mutedColor }}>
      Loading...
    </div>
  )

  return (
    <div style={{ background: bg, minHeight: 'calc(100vh - 64px)', padding: '2rem 2.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {(upcoming.length > 0 || medsDue.length > 0) && (
          <div style={{ background: '#eef1ff', border: '1px solid #c7d2fe', borderRadius: '10px', padding: '0.75rem 1.25rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#3730a3' }}>
            <span>📋</span>
            {upcoming.length > 0 && <span>{upcoming.length} upcoming appointment{upcoming.length > 1 ? 's' : ''}</span>}
            {upcoming.length > 0 && medsDue.length > 0 && <span style={{ color: '#a5b4fc' }}>·</span>}
            {medsDue.length > 0 && <span>{medsDue.length} medication{medsDue.length > 1 ? 's' : ''} pending today</span>}
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: textColor }}>Welcome back, {user?.name} 👋</h1>
          <p style={{ color: mutedColor, fontSize: '0.9rem', marginTop: '0.25rem' }}>{today.toDateString()}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
          {statCards.map(card => (
            <Link to={card.path} key={card.label} style={{ textDecoration: 'none' }}>
              <div style={{ background: cardBg, border, borderRadius: '12px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{card.icon}</span>
                  <span style={{ background: card.bg, color: card.color, fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>View</span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: card.color, lineHeight: 1 }}>{card.value}</div>
                <div style={{ color: mutedColor, fontSize: '0.82rem', marginTop: '0.4rem' }}>{card.label}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem' }}>
          <div style={{ background: cardBg, border, borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: textColor, marginBottom: '1.25rem' }}>Weight Trend</h3>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#2a2a3e' : '#f0f0f0'} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: mutedColor }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: mutedColor }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: cardBg, border, borderRadius: '8px', fontSize: '0.85rem' }} />
                  <Line type="monotone" dataKey="weight" stroke="#4361ee" strokeWidth={2.5} dot={{ fill: '#4361ee', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: mutedColor }}>
                <span style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚖️</span>
                <p style={{ fontSize: '0.88rem' }}>No weight data yet</p>
                <Link to="/metrics" style={{ color: '#4361ee', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 500 }}>Add your first entry →</Link>
              </div>
            )}
          </div>

          <div style={{ background: cardBg, border, borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: textColor, marginBottom: '1.25rem' }}>Upcoming Appointments</h3>
            {upcoming.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '180px', color: mutedColor }}>
                <span style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📅</span>
                <p style={{ fontSize: '0.88rem' }}>No upcoming appointments</p>
                <Link to="/appointments" style={{ color: '#4361ee', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 500 }}>Schedule one →</Link>
              </div>
            ) : (
              <div>
                {upcoming.slice(0, 5).map((a, i) => (
                  <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: i < upcoming.slice(0,5).length - 1 ? `1px solid ${dark ? '#2a2a3e' : '#f0f2f5'}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4361ee', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.9rem', color: textColor, fontWeight: 500 }}>{a.doctor}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: mutedColor }}>{new Date(a.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
