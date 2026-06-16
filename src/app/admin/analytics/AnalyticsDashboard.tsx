// ════════════════════════════════════════════════
// ADMIN — Statistika dashboard (Client)
// /src/app/admin/analytics/AnalyticsDashboard.tsx
// Sof SVG grafiklar — tashqi kutubxonasiz
// ════════════════════════════════════════════════

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Users, FileText, MessageSquare, MessageCircle, TrendingUp, TrendingDown,
  Shield, Star, Flag, Loader2, Briefcase, UserCheck
} from 'lucide-react'

interface OverviewData {
  period_days: number
  totals: {
    users: number; lawyers: number; clients: number; verified_lawyers: number
    ads: number; ads_open: number; conversations: number; messages: number
    reviews: number; reports_pending: number
  }
  period: { users: number; ads: number; conversations: number; messages: number }
  growth: { users: number; ads: number; conversations: number; messages: number }
}

interface TimeseriesPoint {
  day: string
  new_users: number
  new_ads: number
  new_conversations: number
  new_messages: number
}

interface CategoryData { category: string; count: number }

interface DistributionData {
  ad_status: { label: string; count: number }[] | null
  user_roles: { label: string; count: number }[] | null
  top_cities: { label: string; count: number }[] | null
}

interface Props {
  initialData: {
    overview: OverviewData | null
    timeseries: TimeseriesPoint[]
    categories: CategoryData[]
    distribution: DistributionData | null
  }
}

const PERIODS = [
  { days: 7, label: '7 kun' },
  { days: 30, label: '30 kun' },
  { days: 90, label: '90 kun' },
]

export default function AnalyticsDashboard({ initialData }: Props) {
  const [data, setData] = useState(initialData)
  const [period, setPeriod] = useState(30)
  const [loading, setLoading] = useState(false)

  const reload = async (days: number) => {
    setLoading(true)
    setPeriod(days)
    const [overview, timeseries, categories, distribution] = await Promise.all([
      supabase.rpc('admin_analytics_overview', { p_days: days }),
      supabase.rpc('admin_analytics_timeseries', { p_days: days }),
      supabase.rpc('admin_analytics_categories'),
      supabase.rpc('admin_analytics_distribution'),
    ])
    setData({
      overview: overview.data || null,
      timeseries: timeseries.data || [],
      categories: categories.data || [],
      distribution: distribution.data || null,
    })
    setLoading(false)
  }

  const ov = data.overview
  if (!ov) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Ma'lumot yo'q</div>

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', marginBottom: 4 }}>
            Statistika
          </h1>
          <p style={{ fontSize: 13, color: '#64748b' }}>Platforma ko'rsatkichlari va o'sish dinamikasi</p>
        </div>
        {/* Period selector */}
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 4, borderRadius: 10 }}>
          {PERIODS.map((p) => (
            <button key={p.days} onClick={() => reload(p.days)} disabled={loading} style={{
              padding: '7px 14px', borderRadius: 7,
              background: period === p.days ? '#fff' : 'transparent',
              color: period === p.days ? '#0f172a' : '#64748b',
              border: 'none', fontSize: 12, fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit',
              boxShadow: period === p.days ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>{p.label}</button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 8, marginBottom: 12 }}>
          <Loader2 size={16} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {/* KPI cards — period (o'sish bilan) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12, marginBottom: 14,
      }}>
        <KpiCard icon={Users} label="Yangi foydalanuvchilar" value={ov.period.users} growth={ov.growth.users} color="#4338ca" periodDays={period} />
        <KpiCard icon={FileText} label="Yangi e'lonlar" value={ov.period.ads} growth={ov.growth.ads} color="#ea580c" periodDays={period} />
        <KpiCard icon={MessageSquare} label="Yangi suhbatlar" value={ov.period.conversations} growth={ov.growth.conversations} color="#0891b2" periodDays={period} />
        <KpiCard icon={MessageCircle} label="Yangi xabarlar" value={ov.period.messages} growth={ov.growth.messages} color="#16a34a" periodDays={period} />
      </div>

      {/* O'sish chizig'i */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, marginBottom: 14 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
          O'sish dinamikasi
        </h2>
        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
          Oxirgi {period} kun ichida kunlik faollik
        </p>
        <LineChart data={data.timeseries} />
        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <LegendItem color="#4338ca" label="Foydalanuvchilar" />
          <LegendItem color="#ea580c" label="E'lonlar" />
          <LegendItem color="#0891b2" label="Suhbatlar" />
        </div>
      </div>

      {/* 2 ustun — kategoriyalar + taqsimot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14, marginBottom: 14 }}>
        {/* Kategoriyalar (donut) */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
            E'lonlar kategoriyalari
          </h2>
          {data.categories.length === 0 ? (
            <Empty text="E'lonlar yo'q" />
          ) : (
            <DonutChart data={data.categories} />
          )}
        </div>

        {/* E'lon statuslari (bar) */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
            E'lonlar holati
          </h2>
          {!data.distribution?.ad_status || data.distribution.ad_status.length === 0 ? (
            <Empty text="Ma'lumot yo'q" />
          ) : (
            <BarList data={data.distribution.ad_status.map(s => ({ label: statusLabel(s.label), count: s.count }))} color="#ea580c" />
          )}
        </div>
      </div>

      {/* Umumiy ko'rsatkichlar */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
          Umumiy ko'rsatkichlar
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12,
        }}>
          <TotalStat icon={Users} label="Jami foydalanuvchi" value={ov.totals.users} color="#4338ca" />
          <TotalStat icon={Briefcase} label="Yuristlar" value={ov.totals.lawyers} color="#7c3aed" />
          <TotalStat icon={UserCheck} label="Mijozlar" value={ov.totals.clients} color="#0891b2" />
          <TotalStat icon={Shield} label="Tasdiqlangan yurist" value={ov.totals.verified_lawyers} color="#16a34a" />
          <TotalStat icon={FileText} label="Jami e'lon" value={ov.totals.ads} color="#ea580c" />
          <TotalStat icon={FileText} label="Faol e'lon" value={ov.totals.ads_open} color="#16a34a" />
          <TotalStat icon={MessageSquare} label="Suhbatlar" value={ov.totals.conversations} color="#0891b2" />
          <TotalStat icon={MessageCircle} label="Xabarlar" value={ov.totals.messages} color="#0369a1" />
          <TotalStat icon={Star} label="Sharhlar" value={ov.totals.reviews} color="#d97706" />
          <TotalStat icon={Flag} label="Kutilayotgan shikoyat" value={ov.totals.reports_pending} color="#dc2626" />
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─────────────────────────────────────────
// KPI Card (o'sish foizi bilan)
// ─────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, growth, color, periodDays }: any) {
  const isPositive = growth >= 0
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: color + '15',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} color={color} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          padding: '3px 8px', borderRadius: 999,
          background: isPositive ? '#f0fdf4' : '#fef2f2',
          color: isPositive ? '#15803d' : '#b91c1c',
          fontSize: 11, fontWeight: 700,
        }}>
          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(growth)}%
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.5px' }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{label}</div>
      <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 2 }}>oldingi {periodDays} kunga nisbatan</div>
    </div>
  )
}

// ─────────────────────────────────────────
// Line Chart (sof SVG, 3 chiziq)
// ─────────────────────────────────────────
function LineChart({ data }: { data: TimeseriesPoint[] }) {
  if (!data || data.length === 0) return <Empty text="Ma'lumot yo'q" />

  const W = 1000, H = 260, PAD = 30, PAD_BOTTOM = 28
  const chartW = W - PAD * 2
  const chartH = H - PAD - PAD_BOTTOM

  // Maksimal qiymat (barcha 3 seriya bo'yicha)
  const allValues = data.flatMap(d => [d.new_users, d.new_ads, d.new_conversations])
  const maxVal = Math.max(...allValues, 1)
  const niceMax = Math.ceil(maxVal / 5) * 5 || 5

  const n = data.length
  const xStep = n > 1 ? chartW / (n - 1) : 0

  const makePath = (key: keyof TimeseriesPoint) => {
    return data.map((d, i) => {
      const x = PAD + i * xStep
      const y = PAD + chartH - ((d[key] as number) / niceMax) * chartH
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')
  }

  const makeArea = (key: keyof TimeseriesPoint) => {
    const line = data.map((d, i) => {
      const x = PAD + i * xStep
      const y = PAD + chartH - ((d[key] as number) / niceMax) * chartH
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')
    const lastX = PAD + (n - 1) * xStep
    return `${line} L ${lastX.toFixed(1)} ${(PAD + chartH).toFixed(1)} L ${PAD.toFixed(1)} ${(PAD + chartH).toFixed(1)} Z`
  }

  // Y o'qi chiziqlari (4 ta)
  const yLines = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    y: PAD + chartH - f * chartH,
    val: Math.round(niceMax * f),
  }))

  // X o'qi yorliqlari (boshi, o'rtasi, oxiri)
  const xLabels = n <= 10
    ? data.map((d, i) => ({ x: PAD + i * xStep, label: fmtDay(d.day), show: true }))
    : data.map((d, i) => ({
        x: PAD + i * xStep,
        label: fmtDay(d.day),
        show: i === 0 || i === n - 1 || i === Math.floor(n / 2),
      }))

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 320, height: 'auto', display: 'block' }}>
        {/* Y grid lines */}
        {yLines.map((yl, i) => (
          <g key={i}>
            <line x1={PAD} y1={yl.y} x2={W - PAD} y2={yl.y} stroke="#f1f5f9" strokeWidth={1} />
            <text x={PAD - 6} y={yl.y + 3} textAnchor="end" fontSize={10} fill="#cbd5e1">{yl.val}</text>
          </g>
        ))}

        {/* Areas */}
        <path d={makeArea('new_users')} fill="#4338ca" opacity={0.06} />

        {/* Lines */}
        <path d={makePath('new_conversations')} fill="none" stroke="#0891b2" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <path d={makePath('new_ads')} fill="none" stroke="#ea580c" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        <path d={makePath('new_users')} fill="none" stroke="#4338ca" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots faqat kam nuqta bo'lsa */}
        {n <= 14 && data.map((d, i) => {
          const x = PAD + i * xStep
          const y = PAD + chartH - (d.new_users / niceMax) * chartH
          return <circle key={i} cx={x} cy={y} r={3} fill="#fff" stroke="#4338ca" strokeWidth={2} />
        })}

        {/* X labels */}
        {xLabels.filter(l => l.show).map((l, i) => (
          <text key={i} x={l.x} y={H - 8} textAnchor="middle" fontSize={10} fill="#94a3b8">{l.label}</text>
        ))}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────
// Donut Chart (kategoriyalar)
// ─────────────────────────────────────────
function DonutChart({ data }: { data: CategoryData[] }) {
  const total = data.reduce((s, d) => s + Number(d.count), 0)
  const COLORS = ['#4338ca', '#ea580c', '#0891b2', '#16a34a', '#d97706', '#db2777', '#7c3aed', '#0369a1']

  const R = 70, STROKE = 26, CX = 90, CY = 90
  const circ = 2 * Math.PI * R
  let offset = 0

  const segments = data.map((d, i) => {
    const frac = Number(d.count) / total
    const len = frac * circ
    const seg = {
      color: COLORS[i % COLORS.length],
      dashArray: `${len} ${circ - len}`,
      dashOffset: -offset,
      pct: Math.round(frac * 100),
      ...d,
    }
    offset += len
    return seg
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <svg width={180} height={180} viewBox="0 0 180 180" style={{ flexShrink: 0 }}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
        {segments.map((s, i) => (
          <circle
            key={i} cx={CX} cy={CY} r={R} fill="none"
            stroke={s.color} strokeWidth={STROKE}
            strokeDasharray={s.dashArray} strokeDashoffset={s.dashOffset}
            transform={`rotate(-90 ${CX} ${CY})`}
            style={{ transition: 'all 0.3s' }}
          />
        ))}
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize={28} fontWeight={800} fill="#0f172a">{total}</text>
        <text x={CX} y={CY + 14} textAnchor="middle" fontSize={11} fill="#94a3b8">e'lon</text>
      </svg>
      <div style={{ flex: 1, minWidth: 130, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#334155', flex: 1 }}>{s.category}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{s.count}</span>
            <span style={{ fontSize: 11, color: '#94a3b8', minWidth: 32, textAlign: 'right' }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Bar List (horizontal)
// ─────────────────────────────────────────
function BarList({ data, color }: { data: { label: string; count: number }[], color: string }) {
  const max = Math.max(...data.map(d => Number(d.count)), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12.5, color: '#334155', fontWeight: 500 }}>{d.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>{d.count}</span>
          </div>
          <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${(Number(d.count) / max) * 100}%`,
              background: color, borderRadius: 999, transition: 'width 0.4s',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// Total Stat (kichik karta)
// ─────────────────────────────────────────
function TotalStat({ icon: Icon, label, value, color }: any) {
  return (
    <div style={{ padding: 14, background: '#f8fafc', borderRadius: 11 }}>
      <Icon size={15} color={color} style={{ marginBottom: 8 }} />
      <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.4px' }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 16, height: 3, borderRadius: 2, background: color }} />
      <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div style={{ padding: 30, textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>{text}</div>
  )
}

// Helpers
function fmtDay(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    open: 'Faol', pending_review: 'Tekshiruvda', in_progress: 'Jarayonda',
    closed: 'Yopilgan', rejected: 'Rad etilgan', auto_rejected: 'Avto rad',
  }
  return map[s] || s
}
