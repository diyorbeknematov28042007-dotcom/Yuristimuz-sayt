// ════════════════════════════════════════════════
// ADMIN — Survey marketing tahlili (client)
// /src/app/admin/survey/SurveyStats.tsx
// ════════════════════════════════════════════════

'use client'

import { BarChart3, Users, TrendingUp, Target, Megaphone, Briefcase } from 'lucide-react'

type Stats = {
  total_completed: number
  total_skipped: number
  referral: Record<string, number>
  profession: Record<string, number>
  motivation: Record<string, number>
} | null

// Rang palitrasi
const COLORS = ['#4338ca', '#0891b2', '#16a34a', '#c2410c', '#7e22ce', '#be123c', '#0f766e', '#a16207', '#1d4ed8', '#9333ea', '#64748b']

function BarBlock({ title, icon, data, color }: { title: string; icon: React.ReactNode; data: Record<string, number>; color: string }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((s, [, v]) => s + v, 0)
  const max = entries.length ? Math.max(...entries.map(([, v]) => v)) : 0

  return (
    <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ width: 38, height: 38, background: `${color}14`, color, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{title}</h3>
          <p style={{ fontSize: 11.5, color: '#94a3b8' }}>{total} ta javob</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>Hozircha ma'lumot yo'q</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {entries.map(([label, count], i) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            const barW = max > 0 ? (count / max) * 100 : 0
            return (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{count} <span style={{ color: '#cbd5e1' }}>·</span> {pct}%</span>
                </div>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${barW}%`, height: '100%', background: COLORS[i % COLORS.length], borderRadius: 4, transition: 'width 400ms' }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function SurveyStats({ stats }: { stats: Stats }) {
  const completed = stats?.total_completed || 0
  const skipped = stats?.total_skipped || 0
  const responseRate = (completed + skipped) > 0 ? Math.round((completed / (completed + skipped)) * 100) : 0

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '8px 4px 40px' }}>
      {/* Sarlavha */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <BarChart3 size={22} color="#4338ca" />
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>So'rovnoma tahlili</h1>
          <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 2 }}>Foydalanuvchilar va marketing kanallari haqida ma'lumot</p>
        </div>
      </div>

      {/* Yuqori ko'rsatkichlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Users size={15} color="#16a34a" />
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>To'ldirgan</span>
          </div>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{completed}</p>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <TrendingUp size={15} color="#4338ca" />
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>To'ldirish darajasi</span>
          </div>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{responseRate}%</p>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>O'tkazib yuborgan</span>
          </div>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#94a3b8' }}>{skipped}</p>
        </div>
      </div>

      {/* Tahlil bloklari */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
        {/* Yuristlar: marketing kanali — ENG MUHIM */}
        <BarBlock
          title="Yuristlar bizni qayerdan eshitgan (marketing kanali)"
          icon={<Megaphone size={18} />}
          data={stats?.referral || {}}
          color="#4338ca"
        />
        {/* Mijozlar: kasblar */}
        <BarBlock
          title="Mijozlar faoliyat sohasi"
          icon={<Briefcase size={18} />}
          data={stats?.profession || {}}
          color="#0891b2"
        />
        {/* Mijozlar: motivatsiya */}
        <BarBlock
          title="Mijozlarni nima olib kelgan"
          icon={<Target size={18} />}
          data={stats?.motivation || {}}
          color="#16a34a"
        />
      </div>
    </div>
  )
}
