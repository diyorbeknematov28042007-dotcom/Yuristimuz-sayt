'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function Fade({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms ease`,
    }}>
      {children}
    </div>
  )
}

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let current = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      current += step
      if (current >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, 16)
    return () => clearInterval(timer)
  }, [start, target, duration])
  return count
}

const specializations = [
  { icon: '👨‍👩‍👧', label: 'Oilaviy huquq', bg: '#fdf2f8', color: '#9d174d' },
  { icon: '🏢', label: 'Biznes huquqi', bg: '#eff6ff', color: '#1d4ed8' },
  { icon: '🏠', label: 'Mulk huquqi', bg: '#f0fdf4', color: '#166534' },
  { icon: '⚒️', label: 'Mehnat huquqi', bg: '#fff7ed', color: '#c2410c' },
  { icon: '💰', label: 'Soliq huquqi', bg: '#fefce8', color: '#854d0e' },
  { icon: '🔒', label: 'Jinoyat huquqi', bg: '#fef2f2', color: '#991b1b' },
  { icon: '📋', label: 'Shartnomalar', bg: '#faf5ff', color: '#7e22ce' },
  { icon: '🌐', label: 'Migratsiya', bg: '#f0fdfa', color: '#134e4a' },
]

const steps = [
  { num: '01', icon: '📝', title: "Elon qo'ying", desc: "Huquqiy muammongizni yozing — bepul va tez", color: '#eff6ff', iconColor: '#1d4ed8' },
  { num: '02', icon: '🔍', title: 'Yurist toping', desc: "Soha, reyting va joylashuv bo'yicha filtrlang", color: '#f0fdf4', iconColor: '#166534' },
  { num: '03', icon: '💬', title: "Bog'laning", desc: "Real-time chat orqali darhol muloqot qiling", color: '#faf5ff', iconColor: '#7e22ce' },
  { num: '04', icon: '✅', title: 'Natija oling', desc: "Professional yordam bilan muammoni yechin", color: '#fff7ed', iconColor: '#c2410c' },
]

const features = [
  { icon: '🔍', title: 'Aqlli qidiruv', desc: "Soha, tajriba va joylashuv bo'yicha filtrlang", bg: '#eff6ff' },
  { icon: '💬', title: 'Real-time chat', desc: "Yurist bilan platformada to'g'ridan-to'g'ri gaplashing", bg: '#f0fdf4' },
  { icon: '🤖', title: 'AI maslahat', desc: "Oddiy savollarga darhol javob, so'ng yuristga yo'naltirilasiz", bg: '#faf5ff' },
  { icon: '📄', title: 'Hujjat generatsiya', desc: "AI yordamida shartnoma va ariza tuzing", bg: '#fff7ed' },
  { icon: '🗺️', title: 'Advokatura xaritasi', desc: "Yaqin atrofdagi advokatlarni xaritada toping", bg: '#f0fdfa' },
  { icon: '🛡️', title: 'Xavfsiz platforma', desc: "Barcha yuristlar tekshirilgan, reyting tizimi mavjud", bg: '#fef2f2' },
]

const phases = [
  {
    phase: 'Faza 1', title: 'Beta — Hozir',
    badge: '🟢 Bepul', badgeBg: '#f0fdf4', badgeColor: '#166534',
    headerBg: '#4f46e5', items: [
      '✅ Platforma bepul foydalanish',
      '✅ Yuristlar bilan chat',
      '✅ Elon joylash va ko\'rish',
      '✅ Yurist profillari va qidiruv',
      '✅ Beta — barcha feedback qabul',
    ],
    note: 'Beta davri — barcha xizmatlar bepul',
  },
  {
    phase: 'Faza 2', title: 'Pro — 2026 Q3',
    badge: '🔵 Kelayotgan', badgeBg: '#eff6ff', badgeColor: '#1d4ed8',
    headerBg: '#334155', items: [
      '⏳ Yuristlar uchun Pro tarif',
      '⏳ Payme va Click to\'lov',
      '⏳ Kredit tizimi',
      '⏳ Advokatura xaritasi',
      '⏳ Profil statistikasi',
    ],
    note: 'Mijozlar uchun asosiy xizmatlar bepul',
  },
  {
    phase: 'Faza 3', title: 'Full — 2027',
    badge: '🟣 Kelajak', badgeBg: '#faf5ff', badgeColor: '#7e22ce',
    headerBg: '#7c3aed', items: [
      '🔮 AI huquqiy chatbot',
      '🔮 Hujjat generatsiyasi (PDF)',
      '🔮 Zoom konsultatsiya',
      '🔮 Yurist workspace',
      '🔮 Mobil ilova (iOS/Android)',
    ],
    note: "To'liq legal-tech ekotizimi",
  },
]

const founders = [
  {
    initials: 'DN', name: 'Diyorbek Nematov', role: 'Founder & CEO',
    desc: "Huquq talabasi va legal-tech tadbirkor. O'zbekistonda huquqiy xizmatlarni raqamlashtirish missiyasi.",
    bg: '#eef2ff', color: '#4338ca', isFounder: true,
    telegram: 'https://t.me/lawyer_nematov', email: 'diyorbeknematov07@gmail.com',
  },
  {
    initials: '?', name: 'Texnik Co-founder', role: 'CTO — Vakansiya',
    desc: "Full-stack developer izlanmoqda. React, Node.js tajribasi. Equity + maosh taklif qilinadi.",
    bg: '#f1f5f9', color: '#64748b', isVacancy: true,
  },
  {
    initials: '?', name: 'Marketing Co-founder', role: 'CMO — Vakansiya',
    desc: "Digital marketing mutaxassisi izlanmoqda. O'zbekiston bozorini biluvchi.",
    bg: '#f1f5f9', color: '#64748b', isVacancy: true,
  },
]

export default function HomePage() {
  const [started, setStarted] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { ref: statsRef, inView: statsInView } = useInView()
  const lawyers = useCountUp(500, 1800, statsInView)
  const ads = useCountUp(1200, 1800, statsInView)
  const regions = useCountUp(14, 1400, statsInView)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'white', fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>

      {/* NAVBAR */}
      <header style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f1f5f9',
        position: 'sticky', top: 0, zIndex: 50,
        opacity: started ? 1 : 0,
        transform: started ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>Y</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', letterSpacing: '-0.3px' }}>Yuristim</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '2px 8px', borderRadius: 6 }}>Beta</span>
          </div>

          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {[['Xizmatlar', '#xizmatlar'], ['Fazalar', '#fazalar'], ['Jamoa', '#jamoa'], ['Aloqa', '#aloqa']].map(([label, href]) => (
              <a key={href} href={href} style={{ fontSize: 14, fontWeight: 500, color: '#64748b', textDecoration: 'none', transition: 'color 150ms' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#0f172a'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#64748b'}>
                {label}
              </a>
            ))}
            <Link href="/auth/login" style={{ fontSize: 14, fontWeight: 600, color: '#64748b', textDecoration: 'none', padding: '8px 16px' }}>
              Kirish
            </Link>
            <Link href="/auth/signup" style={{ fontSize: 14, fontWeight: 600, background: '#4f46e5', color: 'white', padding: '9px 20px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 2px 8px rgba(79,70,229,0.3)', transition: 'all 150ms' }}>
              Bepul boshlash →
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: '80px 20px 64px', background: 'linear-gradient(165deg, #eef2ff 0%, #f8fafc 50%, #ffffff 100%)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ opacity: started ? 1 : 0, transform: started ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.6s 0.1s ease' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #c7d2fe', padding: '6px 16px', borderRadius: 20, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <span style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4338ca' }}>Beta versiyada — barcha xizmatlar bepul</span>
            </div>
          </div>

          <h1 style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.08, marginBottom: 20, letterSpacing: '-1.5px', opacity: started ? 1 : 0, transform: started ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.65s 0.2s ease' }}>
            Kerakli yuristni<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              tez toping
            </span>
          </h1>

          <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 40px', opacity: started ? 1 : 0, transform: started ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.65s 0.3s ease' }}>
            O'zbekistondagi birinchi huquqiy xizmatlar platformasi. Bepul elon qo'ying, tajribali yuristlarni toping.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60, opacity: started ? 1 : 0, transform: started ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.65s 0.4s ease' }}>
            <Link href="/auth/signup?role=client" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4f46e5', color: 'white', fontWeight: 700, fontSize: 16, padding: '14px 28px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 4px 16px rgba(79,70,229,0.35)' }}>
              ⚖️ Yurist topish
            </Link>
            <Link href="/auth/signup?role=lawyer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#1e293b', fontWeight: 700, fontSize: 16, padding: '14px 28px', borderRadius: 14, textDecoration: 'none', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              💼 Yurist sifatida kirish
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, maxWidth: 360, margin: '0 auto', opacity: started ? 1 : 0, transition: 'opacity 0.7s 0.55s ease' }}>
            {[{ value: lawyers, suffix: '+', label: 'Yuristlar' }, { value: ads, suffix: '+', label: 'Elonlar' }, { value: regions, suffix: '', label: 'Viloyat' }].map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '0 16px', borderRight: i < 2 ? '1px solid #e2e8f0' : 'none' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>{s.value}{s.suffix}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALIZATIONS */}
      <section style={{ padding: '72px 20px', background: 'white' }} id="xizmatlar">
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <Fade className="" style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Sohalar</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Barcha sohalarda yordam</h2>
              <p style={{ color: '#64748b', marginTop: 10, fontSize: 15 }}>Qaysi huquqiy masala bo'lmasin — platformamizda mutaxassis bor</p>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {specializations.map((s, i) => (
              <Fade key={s.label} delay={i * 50}>
                <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 16, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c7d2fe'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22 }}>
                    {s.icon}
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{s.label}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '72px 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Jarayon</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Qanday ishlaydi?</h2>
              <p style={{ color: '#64748b', marginTop: 10 }}>4 oddiy qadamda huquqiy muammoni yechin</p>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {steps.map((step, i) => (
              <Fade key={step.num} delay={i * 80}>
                <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 18, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.05em', marginBottom: 14, fontFamily: 'monospace' }}>{step.num}</div>
                  <div style={{ width: 48, height: 48, background: step.color, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 22 }}>
                    {step.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8, fontSize: 15 }}>{step.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '72px 20px', background: 'white' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Imkoniyatlar</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Nima uchun Yuristim?</h2>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {features.map((f, i) => (
              <Fade key={f.title} delay={i * 60}>
                <div style={{ background: 'white', border: '1px solid #f1f5f9', borderRadius: 18, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', transition: 'all 200ms' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c7d2fe'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#f1f5f9'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ width: 48, height: 48, background: f.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 22 }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* PHASES */}
      <section style={{ padding: '72px 20px', background: '#f8fafc' }} id="fazalar">
        <div style={{ maxWidth: 1152, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Rivojlanish</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>Platforma fazalari</h2>
              <p style={{ color: '#64748b', maxWidth: 480, margin: '0 auto' }}>Hozir beta versiyamiz to'liq bepul. Kelajakda qo'shiladigan xizmatlar:</p>
            </div>
          </Fade>

          <Fade>
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, background: '#dcfce7', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>✨</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#166534', marginBottom: 3 }}>Hozir Beta versiyada — hammasi bepul!</p>
                <p style={{ fontSize: 13, color: '#15803d' }}>Platform rivojlanish bosqichida. Sizning fikr va takliflaringiz bizga juda muhim.</p>
              </div>
              <Link href="/auth/signup" style={{ background: '#16a34a', color: 'white', fontWeight: 600, fontSize: 14, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', flexShrink: 0 }}>
                Bepul kirish →
              </Link>
            </div>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {phases.map((phase, i) => (
              <Fade key={phase.phase} delay={i * 80}>
                <div style={{ border: i === 0 ? '2px solid #6366f1' : '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden', background: 'white', boxShadow: i === 0 ? '0 4px 16px rgba(99,102,241,0.15)' : '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ background: phase.headerBg, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{phase.phase} — {phase.title}</span>
                    <span style={{ background: 'rgba(255,255,255,0.9)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, color: phase.headerBg }}>
                      {phase.badge}
                    </span>
                  </div>
                  <div style={{ padding: '20px' }}>
                    {phase.items.map(item => (
                      <div key={item} style={{ fontSize: 13, color: '#475569', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        {item}
                      </div>
                    ))}
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>{phase.note}</p>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* FOR LAWYERS */}
      <section style={{ padding: '72px 20px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <Fade>
            <div style={{ fontSize: 48, marginBottom: 20 }}>⚖️</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 16, letterSpacing: '-0.5px' }}>Yuristmisiz?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 32, lineHeight: 1.6 }}>
              14 kun bepul sinab ko'ring. Yangi mijozlar toping va biznesingizni rivojlantiring.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, maxWidth: 480, margin: '0 auto 32px' }}>
              {[{ icon: '🎯', text: 'Maqsadli mijozlar' }, { icon: '📊', text: 'Profil statistikasi' }, { icon: '💼', text: 'Workspace' }].map(item => (
                <div key={item.text} style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/signup?role=lawyer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#4f46e5', fontWeight: 700, fontSize: 16, padding: '14px 32px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
              Bepul boshlash →
            </Link>
          </Fade>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ padding: '72px 20px', background: 'white' }} id="jamoa">
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Jamoa</p>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Founders</h2>
              <p style={{ color: '#64748b', marginTop: 10 }}>Co-founder vakansiyalari ochiq — qiziqsangiz bog'laning!</p>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {founders.map((f, i) => (
              <Fade key={f.name} delay={i * 80}>
                <div style={{ border: f.isVacancy ? '1.5px dashed #e2e8f0' : '1px solid #f1f5f9', borderRadius: 20, padding: 24, background: f.isVacancy ? '#fafafa' : 'white', transition: 'all 200ms', boxShadow: f.isFounder ? '0 4px 16px rgba(99,102,241,0.1)' : 'none' }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ width: 52, height: 52, background: f.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: f.color, flexShrink: 0 }}>
                      {f.isVacancy ? '?' : f.initials}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: f.isVacancy ? '#94a3b8' : '#0f172a', fontSize: 15 }}>{f.name}</p>
                      <span style={{ fontSize: 11, fontWeight: 700, background: f.isVacancy ? '#fff7ed' : '#eef2ff', color: f.isVacancy ? '#c2410c' : '#4338ca', padding: '2px 8px', borderRadius: 5 }}>
                        {f.role}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>{f.desc}</p>
                  {f.isFounder && (
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <a href={f.telegram} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>
                        <span style={{ width: 28, height: 28, background: '#eef2ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✈️</span>
                        @lawyer_nematov
                      </a>
                      <a href={`mailto:${f.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
                        <span style={{ width: 28, height: 28, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📧</span>
                        {f.email}
                      </a>
                    </div>
                  )}
                  {f.isVacancy && (
                    <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff7ed', color: '#c2410c', fontWeight: 600, fontSize: 13, padding: '10px', borderRadius: 10, textDecoration: 'none', border: '1px solid #fed7aa' }}>
                      ✈️ Murojaat qilish
                    </a>
                  )}
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: '72px 20px', background: '#f8fafc' }} id="aloqa">
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <Fade>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Aloqa</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 12 }}>Bog'laning</h2>
            <p style={{ color: '#64748b', marginBottom: 32 }}>Savol, taklif yoki hamkorlik uchun murojaat qiling</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#4f46e5', color: 'white', fontWeight: 600, fontSize: 15, padding: '13px 24px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}>
                ✈️ Telegram orqali
              </a>
              <a href="mailto:diyorbeknematov07@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'white', color: '#1e293b', fontWeight: 600, fontSize: 15, padding: '13px 24px', borderRadius: 12, textDecoration: 'none', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                📧 Email orqali
              </a>
            </div>
          </Fade>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px', background: '#0f172a' }}>
        <Fade>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <div style={{ width: 52, height: 52, background: '#4f46e5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 24 }}>⚖️</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 14, letterSpacing: '-0.5px' }}>Bugunoq boshlang</h2>
            <p style={{ color: '#64748b', marginBottom: 8, fontSize: 16 }}>Beta versiya — barcha xizmatlar bepul</p>
            <p style={{ color: '#475569', marginBottom: 36, fontSize: 14 }}>Ro'yxatdan o'tish 1 daqiqa. Hech qanday karta kerak emas.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4f46e5', color: 'white', fontWeight: 700, fontSize: 16, padding: '16px 36px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 8px 32px rgba(79,70,229,0.4)' }}>
              Bepul ro'yxatdan o'tish →
            </Link>
          </div>
        </Fade>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#020617', borderTop: '1px solid #1e293b', padding: '32px 20px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 13 }}>Y</span>
            </div>
            <span style={{ fontWeight: 700, color: 'white', fontSize: 15 }}>Yuristim</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: '#14532d', color: '#4ade80', padding: '2px 7px', borderRadius: 5 }}>Beta</span>
          </div>
          <p style={{ color: '#475569', fontSize: 13 }}>© 2026 Yuristim. Barcha huquqlar himoyalangan.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>✈️ Telegram</a>
            <a href="mailto:diyorbeknematov07@gmail.com" style={{ color: '#64748b', fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>📧 Email</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
