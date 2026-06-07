'use client'

import Link from 'next/link'

const services = [
  {
    icon: '🗺️',
    title: 'Xaritadan yurist topish',
    desc: "Yaqin atrofdagi advokatlarni Yandex Maps orqali toping",
    href: '/dashboard/map',
    color: '#eff6ff',
    textColor: '#1d4ed8',
    available: false,
    phase: 'Faza 2',
  },
  {
    icon: '📄',
    title: 'Hujjat generatsiyasi',
    desc: "AI yordamida shartnoma va ariza tuzing",
    href: '/dashboard/docs',
    color: '#faf5ff',
    textColor: '#7e22ce',
    available: false,
    phase: 'Faza 2',
  },
  {
    icon: '🎥',
    title: 'Zoom konsultatsiya',
    desc: "Video muloqot orqali yurist bilan gaplashing",
    href: '/dashboard/zoom',
    color: '#f0fdf4',
    textColor: '#166534',
    available: false,
    phase: 'Faza 3',
  },
  {
    icon: '✈️',
    title: 'Qo\'llab-quvvatlash',
    desc: "Savollar va muammolar uchun bizga yozing",
    href: 'https://t.me/lawyer_nematov',
    color: '#fefce8',
    textColor: '#854d0e',
    available: true,
    external: true,
  },
  {
    icon: '❓',
    title: 'Ko\'p beriladigan savollar',
    desc: "Eng ko'p so'raladigan huquqiy savollar",
    href: '/dashboard/faq',
    color: '#fff7ed',
    textColor: '#c2410c',
    available: true,
  },
  {
    icon: '💎',
    title: 'Obunalar',
    desc: "Pro va Enterprise tariflar — kengaytirilgan imkoniyatlar",
    href: '/dashboard/plans',
    color: '#fafafa',
    textColor: '#475569',
    available: false,
    phase: 'Faza 2',
  },
]

const faqs = [
  { q: "Platforma to'lovlimi?", a: "Beta versiyada hammasi bepul. Faza 2 dan boshlab yuristlar uchun ixtiyoriy Pro tarif joriy etiladi." },
  { q: "Yurist verifikatsiyasi nima?", a: "Admin tomonidan tasdiqlanmish yuristlar blue badge oladi. Bu ularning haqiqiy yurist ekanligini bildiradi." },
  { q: "Suhbatdan keyin nima bo'ladi?", a: "Xizmat yakunlangach, mijoz yuristga 10 ballik tizimda baho va sharh qoldirishi mumkin." },
  { q: "Parolni unutsam nima qilaman?", a: "Login sahifasida 'Parolni unutdingizmi?' tugmasini bosing va emailingizga kod yuboriladi." },
  { q: "Elon qanday o'chiriladi?", a: "Hozircha admin orqali. Faza 2 da shaxsiy boshqaruv paneli qo'shiladi." },
]

export default function ServicesPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', marginBottom: 20 }}>Xizmatlar</h1>

      {/* Services grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
        {services.map(s => {
          const Card = (
            <div style={{
              background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: '18px 16px',
              cursor: s.available ? 'pointer' : 'default', transition: 'all 200ms', height: '100%',
              opacity: s.available ? 1 : 0.8,
            }}
              onMouseEnter={e => s.available && ((e.currentTarget as HTMLElement).style.borderColor = '#0f172a')}
              onMouseLeave={e => s.available && ((e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0')}>
              <div style={{ width: 44, height: 44, background: s.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, fontSize: 22 }}>
                {s.icon}
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 5, lineHeight: 1.3 }}>{s.title}</p>
              <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.5 }}>{s.desc}</p>
              {!s.available && s.phase && (
                <div style={{ marginTop: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#fafafa', color: '#94a3b8', padding: '3px 8px', borderRadius: 5, border: '0.5px solid #e2e8f0' }}>
                    {s.phase} da qo'shiladi
                  </span>
                </div>
              )}
              {s.available && (
                <div style={{ marginTop: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: 5, border: '0.5px solid #bbf7d0' }}>
                    ✓ Mavjud
                  </span>
                </div>
              )}
            </div>
          )

          if (!s.available) return <div key={s.title}>{Card}</div>
          if (s.external) return <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{Card}</a>
          return <Link key={s.title} href={s.href} style={{ textDecoration: 'none' }}>{Card}</Link>
        })}
      </div>

      {/* FAQ */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>Ko'p beriladigan savollar</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqs.map((f, i) => (
            <details key={i} style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              <summary style={{ padding: '14px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0f172a', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {f.q}
                <span style={{ fontSize: 18, color: '#94a3b8', userSelect: 'none' }}>+</span>
              </summary>
              <div style={{ padding: '0 16px 14px', fontSize: 13, color: '#64748b', lineHeight: 1.6, borderTop: '0.5px solid #f1f5f9', paddingTop: 12 }}>
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}
