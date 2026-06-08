'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Scale, Search, MessageCircle, FileText, MapPin, Bot,
  CheckCircle2, ArrowRight, Shield, Users, Mail, Send,
  Sparkles, Building2, TrendingUp, Lock, Globe, Briefcase,
  ChevronRight, Clock, Crown, Zap, Menu, X
} from 'lucide-react'

// ── Hooks ──────────────────────────────────────────────
function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return m
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function Fade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: `opacity .65s ${delay}ms ease, transform .65s ${delay}ms ease` }}>
      {children}
    </div>
  )
}

function useCountUp(target: number, duration = 1800, start = false) {
  const [c, setC] = useState(0)
  useEffect(() => {
    if (!start) return
    let cur = 0; const step = target / (duration / 16)
    const t = setInterval(() => { cur += step; if (cur >= target) { setC(target); clearInterval(t) } else setC(Math.floor(cur)) }, 16)
    return () => clearInterval(t)
  }, [start, target, duration])
  return c
}

// ── Data ───────────────────────────────────────────────
const specs = [
  { icon: <Users size={20} />, label: 'Oilaviy', bg: '#fef2f2', color: '#991b1b' },
  { icon: <Building2 size={20} />, label: 'Biznes', bg: '#eff6ff', color: '#1d4ed8' },
  { icon: <MapPin size={20} />, label: 'Mulk', bg: '#f0fdf4', color: '#166534' },
  { icon: <Briefcase size={20} />, label: 'Mehnat', bg: '#fff7ed', color: '#c2410c' },
  { icon: <TrendingUp size={20} />, label: 'Soliq', bg: '#fefce8', color: '#854d0e' },
  { icon: <Lock size={20} />, label: 'Jinoyat', bg: '#fef2f2', color: '#991b1b' },
  { icon: <FileText size={20} />, label: 'Shartnoma', bg: '#faf5ff', color: '#7e22ce' },
  { icon: <Globe size={20} />, label: 'Migratsiya', bg: '#f0fdfa', color: '#134e4a' },
]

const steps = [
  { num: '01', icon: <FileText size={20} />, title: "Elon qo'ying", desc: "Muammoni yozing", color: '#eff6ff', icolor: '#1d4ed8' },
  { num: '02', icon: <Search size={20} />, title: 'Yurist toping', desc: "Soha va reyting bo'yicha", color: '#f0fdf4', icolor: '#166534' },
  { num: '03', icon: <MessageCircle size={20} />, title: "Bog'laning", desc: "Real-time chat", color: '#faf5ff', icolor: '#7e22ce' },
  { num: '04', icon: <CheckCircle2 size={20} />, title: 'Natija oling', desc: "Muammoni yechin", color: '#fff7ed', icolor: '#c2410c' },
]

const features = [
  { icon: <Search size={20} />, title: 'Aqlli qidiruv', desc: "Soha, tajriba va joylashuv bo'yicha filtrlang", bg: '#eff6ff', c: '#1d4ed8' },
  { icon: <MessageCircle size={20} />, title: 'Real-time chat', desc: "Yurist bilan platformada gaplashing", bg: '#f0fdf4', c: '#166534' },
  { icon: <Bot size={20} />, title: 'AI maslahat', desc: "Darhol javob, keyin yuristga yo'naltirilasiz", bg: '#faf5ff', c: '#7e22ce' },
  { icon: <FileText size={20} />, title: 'Hujjat generatsiya', desc: "AI bilan shartnoma tuzing", bg: '#fff7ed', c: '#c2410c' },
  { icon: <MapPin size={20} />, title: 'Advokatura xaritasi', desc: "Yaqin atrofdagi advokatlarni toping", bg: '#f0fdfa', c: '#134e4a' },
  { icon: <Shield size={20} />, title: 'Xavfsiz platforma', desc: "Tekshirilgan yuristlar, reyting tizimi", bg: '#fef2f2', c: '#991b1b' },
]

const phases = [
  { phase: 'Faza 1', title: 'Beta — Hozir', badge: 'BEPUL', badgeBg: '#dcfce7', badgeC: '#166534', accent: true, icon: <Sparkles size={14} />,
    items: ["Platforma to'liq bepul", "Yuristlar bilan chat", "Elon joylash va ko'rish", "Yurist profillari", "Asosiy qidiruv"], note: 'Beta davri — hammasi bepul' },
  { phase: 'Faza 2', title: 'Pro — 2026 Q3', badge: 'KELAYOTGAN', badgeBg: '#eff6ff', badgeC: '#1d4ed8', icon: <Zap size={14} />,
    items: ["Yuristlar uchun Pro tarif", "Payme va Click to'lov", "Kredit tizimi", "Advokatura xaritasi", "Profil statistikasi"], note: "Mijozlar uchun asosiy xizmatlar bepul" },
  { phase: 'Faza 3', title: 'Full — 2027', badge: 'KELAJAK', badgeBg: '#faf5ff', badgeC: '#7e22ce', icon: <Crown size={14} />,
    items: ['AI huquqiy chatbot', 'Hujjat generatsiyasi', 'Zoom konsultatsiya', 'Yurist workspace', 'Mobil ilova'], note: "To'liq legal-tech ekotizimi" },
]

const founders = [
  { ini: 'DN', name: 'Diyorbek Nematov', role: 'Founder & CEO', desc: "Huquq talabasi va legal-tech tadbirkor.", badge: 'CEO', isFounder: true, telegram: 'https://t.me/lawyer_nematov', email: 'diyorbeknematov07@gmail.com', handle: '@lawyer_nematov' },
  { ini: '?', name: 'Texnik Co-founder', role: 'CTO', desc: "Full-stack developer izlanmoqda. Equity + maosh.", isVacancy: true },
  { ini: '?', name: 'Marketing Co-founder', role: 'CMO', desc: "Digital marketing mutaxassisi izlanmoqda.", isVacancy: true },
]

// ── Main Component ─────────────────────────────────────
export default function HomePage() {
  const isMobile = useIsMobile()
  const [started, setStarted] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { ref: statsRef, inView: statsInView } = useInView()
  const lawyers = useCountUp(500, 1800, statsInView)
  const ads = useCountUp(1200, 1800, statsInView)
  const regions = useCountUp(14, 1400, statsInView)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const sp = isMobile ? '48px 16px' : '72px 24px' // section padding
  const sp2 = isMobile ? '32px 16px' : '64px 24px'

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif", color: '#0f172a' }}>

      {/* ── NAVBAR ── */}
      <header style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '0.5px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50, opacity: started ? 1 : 0, transform: started ? 'translateY(0)' : 'translateY(-16px)', transition: 'opacity .5s ease, transform .5s ease' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', height: isMobile ? 56 : 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: isMobile ? 30 : 34, height: isMobile ? 30 : 34, background: '#0f172a', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={isMobile ? 14 : 16} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: isMobile ? 15 : 17, color: '#0f172a', letterSpacing: '-0.3px' }}>Yuristim</span>
            <span style={{ fontSize: 9, fontWeight: 700, background: '#dcfce7', color: '#166534', padding: '2px 7px', borderRadius: 4 }}>BETA</span>
          </div>

          {/* Desktop nav */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              {[['Xizmatlar', '#xizmatlar'], ['Fazalar', '#fazalar'], ['Jamoa', '#jamoa'], ['Aloqa', '#aloqa']].map(([label, href]) => (
                <a key={href} href={href} style={{ fontSize: 13.5, fontWeight: 500, color: '#475569', textDecoration: 'none', transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0f172a'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}>
                  {label}
                </a>
              ))}
            </nav>
          )}

          {/* CTA + mobile menu */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!isMobile && (
              <Link href="/auth/login" style={{ fontSize: 13.5, fontWeight: 600, color: '#475569', textDecoration: 'none', padding: '8px 14px' }}>
                Kirish
              </Link>
            )}
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: isMobile ? 13 : 13.5, fontWeight: 700, background: '#0f172a', color: '#fff', padding: isMobile ? '8px 14px' : '9px 18px', borderRadius: 9, textDecoration: 'none' }}>
              Boshlash {!isMobile && <ArrowRight size={13} />}
            </Link>
            {isMobile && (
              <button onClick={() => setMobileMenu(!mobileMenu)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#0f172a' }}>
                {mobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobile && mobileMenu && (
          <div style={{ borderTop: '0.5px solid #f1f5f9', background: '#fff', padding: '12px 16px 16px' }}>
            {[['Xizmatlar', '#xizmatlar'], ['Fazalar', '#fazalar'], ['Jamoa', '#jamoa'], ['Aloqa', '#aloqa']].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMobileMenu(false)}
                style={{ display: 'block', padding: '10px 0', fontSize: 15, fontWeight: 500, color: '#0f172a', textDecoration: 'none', borderBottom: '0.5px solid #f8fafc' }}>
                {label}
              </a>
            ))}
            <Link href="/auth/login" onClick={() => setMobileMenu(false)}
              style={{ display: 'block', padding: '10px 0', fontSize: 15, fontWeight: 500, color: '#475569', textDecoration: 'none' }}>
              Kirish
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section style={{ padding: isMobile ? '48px 16px 40px' : '80px 24px 64px', textAlign: 'center', background: 'linear-gradient(180deg, #f8fafc 0%, #fff 100%)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Badge */}
          <div style={{ opacity: started ? 1 : 0, transform: started ? 'translateY(0)' : 'translateY(14px)', transition: 'all .6s .1s ease', marginBottom: isMobile ? 18 : 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: '0.5px solid #e2e8f0', padding: '5px 14px', borderRadius: 100, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: '#475569' }}>Beta versiyada · Hozir bepul</span>
            </div>
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: isMobile ? 36 : 62, fontWeight: 900, lineHeight: 1.06,
            marginBottom: isMobile ? 14 : 20, letterSpacing: isMobile ? '-1px' : '-2px',
            color: '#0f172a', opacity: started ? 1 : 0,
            transform: started ? 'translateY(0)' : 'translateY(22px)',
            transition: 'all .65s .2s ease',
          }}>
            Huquqiy yordam<br />
            <span style={{ background: 'linear-gradient(135deg,#0f172a 0%,#4338ca 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              bir bosishda
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: isMobile ? 14 : 17, color: '#64748b', lineHeight: 1.65, maxWidth: 500, margin: `0 auto ${isMobile ? '28px' : '36px'}`, opacity: started ? 1 : 0, transform: started ? 'none' : 'translateY(18px)', transition: 'all .65s .3s ease' }}>
            O'zbekistondagi birinchi raqamli huquqiy platforma. Tajribali yuristlar, tezkor yechim.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: isMobile ? 36 : 52, opacity: started ? 1 : 0, transform: started ? 'none' : 'translateY(14px)', transition: 'all .65s .4s ease' }}>
            <Link href="/auth/signup?role=client" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: isMobile ? 14 : 15, padding: isMobile ? '12px 22px' : '13px 26px', borderRadius: 11, textDecoration: 'none', boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}>
              Yurist topish <ArrowRight size={14} />
            </Link>
            <Link href="/auth/signup?role=lawyer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#0f172a', fontWeight: 700, fontSize: isMobile ? 14 : 15, padding: isMobile ? '12px 22px' : '13px 26px', borderRadius: 11, textDecoration: 'none', border: '1px solid #e2e8f0' }}>
              <Briefcase size={14} /> Yurist sifatida
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, padding: isMobile ? '14px 20px' : '18px 32px', background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', opacity: started ? 1 : 0, transition: 'opacity .7s .55s ease' }}>
            {[{ value: lawyers, suffix: '+', label: 'Yuristlar' }, { value: ads, suffix: '+', label: 'Elonlar' }, { value: regions, suffix: '', label: 'Viloyat' }].map((s, i) => (
              <div key={s.label} style={{ textAlign: 'left', padding: isMobile ? '0 14px' : '0 22px', borderLeft: i > 0 ? '0.5px solid #e2e8f0' : 'none' }}>
                <div style={{ fontSize: isMobile ? 24 : 30, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>
                  {s.value}<span style={{ color: '#4338ca' }}>{s.suffix}</span>
                </div>
                <div style={{ fontSize: isMobile ? 9 : 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALIZATIONS ── */}
      <section style={{ padding: sp2, background: '#fafafa', borderTop: '0.5px solid #f1f5f9' }} id="xizmatlar">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 40 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Sohalar</p>
              <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 8 }}>Har bir holatga mutaxassis</h2>
              {!isMobile && <p style={{ color: '#64748b', fontSize: 15 }}>Qaysi huquqiy masala bo'lmasin — platformamizda tajribali yurist bor</p>}
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 8 : 12 }}>
            {specs.map((s, i) => (
              <Fade key={s.label} delay={i * 40}>
                <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: isMobile ? 12 : 14, padding: isMobile ? '12px 6px' : '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 200ms' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0f172a'; el.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e2e8f0'; el.style.transform = 'translateY(0)' }}>
                  <div style={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, background: s.bg, color: s.color, borderRadius: isMobile ? 10 : 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: isMobile ? 6 : 12 }}>
                    {isMobile ? <span style={{ fontSize: 16 }}>{[<Users />, <Building2 />, <MapPin />, <Briefcase />, <TrendingUp />, <Lock />, <FileText />, <Globe />][i]}</span> : s.icon}
                  </div>
                  <p style={{ fontSize: isMobile ? 10 : 13, fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>{s.label.replace(' huquqi', isMobile ? '' : ' huquqi')}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: sp, background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 44 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Jarayon</p>
              <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Qanday ishlaydi?</h2>
              {!isMobile && <p style={{ color: '#64748b', marginTop: 10 }}>4 oddiy qadamda huquqiy muammoni yechin</p>}
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 10 : 16 }}>
            {steps.map((s, i) => (
              <Fade key={s.num} delay={i * 70}>
                <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: isMobile ? 14 : 16, padding: isMobile ? 16 : 24, height: '100%' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.1em', marginBottom: 10, fontFamily: 'monospace' }}>{s.num}</div>
                  <div style={{ width: isMobile ? 40 : 46, height: isMobile ? 40 : 46, background: s.color, color: s.icolor, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    {s.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 5, fontSize: isMobile ? 13 : 15 }}>{s.title}</h3>
                  <p style={{ fontSize: isMobile ? 11 : 13, color: '#64748b', lineHeight: 1.55 }}>{s.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: sp, background: '#fafafa', borderTop: '0.5px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 44 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Imkoniyatlar</p>
              <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Nima uchun Yuristim?</h2>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 8 : 14 }}>
            {features.map((f, i) => (
              <Fade key={f.title} delay={i * 50}>
                <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: isMobile ? '14px 16px' : '22px', display: 'flex', alignItems: isMobile ? 'center' : 'flex-start', gap: 14, transition: 'all 200ms' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0f172a' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e2e8f0' }}>
                  <div style={{ width: isMobile ? 40 : 46, height: isMobile ? 40 : 46, background: f.bg, color: f.c, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4, fontSize: isMobile ? 14 : 15 }}>{f.title}</h3>
                    <p style={{ fontSize: isMobile ? 12 : 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHASES ── */}
      <section style={{ padding: sp, background: '#fff' }} id="fazalar">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 20 : 36 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Yo'l xaritasi</p>
              <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Platforma fazalari</h2>
            </div>
          </Fade>

          <Fade>
            <div style={{ background: '#0f172a', borderRadius: 16, padding: isMobile ? '16px' : '20px 24px', marginBottom: isMobile ? 16 : 22, display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.08)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={20} color="#4ade80" />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontWeight: 700, color: '#fff', fontSize: isMobile ? 14 : 15, marginBottom: 3 }}>Hozir Beta — hammasi BEPUL</p>
                <p style={{ fontSize: isMobile ? 12 : 13, color: '#94a3b8' }}>Sizning fikr va takliflaringiz bizga juda muhim.</p>
              </div>
              <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#22c55e', color: '#fff', fontWeight: 600, fontSize: 13, padding: '10px 18px', borderRadius: 10, textDecoration: 'none', flexShrink: 0 }}>
                Bepul kirish <ArrowRight size={13} />
              </Link>
            </div>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 10 : 14 }}>
            {phases.map((ph, i) => (
              <Fade key={ph.phase} delay={i * 70}>
                <div style={{ border: ph.accent ? '1.5px solid #0f172a' : '0.5px solid #e2e8f0', borderRadius: 18, background: '#fff', overflow: 'hidden', boxShadow: ph.accent ? '0 4px 16px rgba(15,23,42,0.08)' : 'none', position: 'relative' }}>
                  {ph.accent && <div style={{ position: 'absolute', top: -9, left: 16, background: '#0f172a', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 4, letterSpacing: '0.5px' }}>HOZIR FAOL</div>}
                  <div style={{ padding: isMobile ? '14px 16px' : '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 11, fontWeight: 700 }}>
                        {ph.icon} {ph.phase}
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 800, background: ph.badgeBg, color: ph.badgeC, padding: '3px 9px', borderRadius: 5, letterSpacing: '0.3px' }}>{ph.badge}</span>
                    </div>
                    <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: isMobile ? 16 : 18, marginBottom: 12, letterSpacing: '-0.2px' }}>{ph.title}</h3>
                    <div style={{ display: isMobile ? 'grid' : 'flex', gridTemplateColumns: isMobile ? '1fr 1fr' : undefined, flexDirection: 'column', gap: 8 }}>
                      {ph.items.map(item => (
                        <div key={item} style={{ fontSize: isMobile ? 11 : 12.5, color: '#475569', display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                          <CheckCircle2 size={12} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                          {item}
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 10, borderTop: '0.5px solid #f1f5f9' }}>
                      <p style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>{ph.note}</p>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR LAWYERS ── */}
      <section style={{ padding: sp, background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, background: 'radial-gradient(circle,rgba(67,56,202,.25) 0%,transparent 60%)' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Fade>
            <div style={{ fontSize: isMobile ? 36 : 44, marginBottom: 16 }}>⚖️</div>
            <h2 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: '-0.5px' }}>Yuristmisiz?</h2>
            <p style={{ color: '#94a3b8', fontSize: isMobile ? 14 : 16, marginBottom: 28, lineHeight: 1.65, maxWidth: 480, margin: `0 auto ${isMobile ? '24px' : '32px'}` }}>
              14 kun bepul sinab ko'ring. Yangi mijozlar toping.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 480, margin: `0 auto ${isMobile ? '24px' : '30px'}` }}>
              {[{ icon: <Users size={18} />, text: 'Maqsadli mijozlar' }, { icon: <TrendingUp size={18} />, text: 'Statistika' }, { icon: <Briefcase size={18} />, text: 'Workspace' }].map(item => (
                <div key={item.text} style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: isMobile ? '12px 8px' : '16px 10px', textAlign: 'center' }}>
                  <div style={{ color: '#a5b4fc', marginBottom: 7, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                  <p style={{ fontSize: isMobile ? 10 : 12, color: '#e2e8f0', fontWeight: 500 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/signup?role=lawyer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#0f172a', fontWeight: 700, fontSize: isMobile ? 14 : 15, padding: isMobile ? '13px 24px' : '15px 30px', borderRadius: 12, textDecoration: 'none' }}>
              Bepul boshlash <ArrowRight size={15} />
            </Link>
          </Fade>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: sp, background: '#fff' }} id="jamoa">
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 40 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Jamoa</p>
              <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Founders</h2>
              <p style={{ color: '#64748b', marginTop: 8, fontSize: isMobile ? 13 : 15 }}>Co-founder vakansiyalari ochiq!</p>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 10 : 14 }}>
            {founders.map((f, i) => (
              <Fade key={f.name} delay={i * 70}>
                <div style={{ border: f.isFounder ? '1.5px solid #0f172a' : '1.5px dashed #cbd5e1', borderRadius: 18, padding: isMobile ? 18 : 22, background: f.isVacancy ? '#fafafa' : '#fff', boxShadow: f.isFounder ? '0 4px 16px rgba(15,23,42,0.07)' : 'none', position: 'relative' }}>
                  {f.isFounder && <div style={{ position: 'absolute', top: -10, right: 16, background: '#0f172a', color: '#fff', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 4 }}>{f.badge}</div>}
                  {f.isVacancy && <div style={{ position: 'absolute', top: -10, right: 16, background: '#fff7ed', color: '#c2410c', fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 4, border: '0.5px solid #fed7aa' }}>OCHIQ</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ width: isMobile ? 44 : 50, height: isMobile ? 44 : 50, background: f.isFounder ? 'linear-gradient(135deg,#0f172a,#4338ca)' : '#f1f5f9', color: f.isFounder ? '#fff' : '#94a3b8', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                      {f.isVacancy ? <Users size={20} /> : f.ini}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: f.isVacancy ? '#475569' : '#0f172a', fontSize: 15 }}>{f.name}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{f.role}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: isMobile ? 12 : 13, color: '#64748b', lineHeight: 1.6, marginBottom: 14 }}>{f.desc}</p>
                  {f.isFounder && (
                    <div style={{ paddingTop: 12, borderTop: '0.5px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <a href={f.telegram} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#4338ca', textDecoration: 'none', fontWeight: 600 }}>
                        <span style={{ width: 27, height: 27, background: '#eef2ff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={13} color="#4338ca" /></span>
                        {f.handle}
                      </a>
                      <a href={`mailto:${f.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b', textDecoration: 'none' }}>
                        <span style={{ width: 27, height: 27, background: '#f1f5f9', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={13} color="#64748b" /></span>
                        {f.email}
                      </a>
                    </div>
                  )}
                  {f.isVacancy && (
                    <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#fff7ed', color: '#c2410c', fontWeight: 600, fontSize: 13, padding: '10px', borderRadius: 10, textDecoration: 'none', border: '0.5px solid #fed7aa' }}>
                      <Send size={13} /> Murojaat qilish
                    </a>
                  )}
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section style={{ padding: sp2, background: '#fafafa', borderTop: '0.5px solid #f1f5f9' }} id="aloqa">
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <Fade>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Aloqa</p>
            <h2 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 10 }}>Bog'laning</h2>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: isMobile ? 13 : 15 }}>Savol, taklif yoki hamkorlik uchun</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: isMobile ? 13.5 : 14, padding: isMobile ? '12px 20px' : '13px 24px', borderRadius: 12, textDecoration: 'none' }}>
                <Send size={15} /> Telegram
              </a>
              <a href="mailto:diyorbeknematov07@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', color: '#0f172a', fontWeight: 600, fontSize: isMobile ? 13.5 : 14, padding: isMobile ? '12px 20px' : '13px 24px', borderRadius: 12, textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                <Mail size={15} /> Email
              </a>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: isMobile ? '56px 16px' : '80px 24px', background: '#020617', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: isMobile ? 400 : 700, height: 300, background: 'radial-gradient(ellipse,rgba(67,56,202,.15) 0%,transparent 60%)' }} />
        <Fade>
          <div style={{ textAlign: 'center', maxWidth: 520, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#4338ca,#6366f1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', boxShadow: '0 8px 24px rgba(67,56,202,.35)' }}>
              <Scale size={24} color="#fff" />
            </div>
            <h2 style={{ fontSize: isMobile ? 30 : 38, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.5px' }}>Bugunoq boshlang</h2>
            <p style={{ color: '#94a3b8', marginBottom: 6, fontSize: isMobile ? 14 : 16 }}>Beta versiya — barcha xizmatlar bepul</p>
            <p style={{ color: '#475569', marginBottom: 28, fontSize: isMobile ? 12 : 13.5 }}>Ro'yxatdan o'tish 1 daqiqa. Hech qanday karta kerak emas.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0f172a', fontWeight: 700, fontSize: isMobile ? 14 : 15, padding: isMobile ? '13px 28px' : '15px 34px', borderRadius: 12, textDecoration: 'none' }}>
              Bepul ro'yxatdan o'tish <ArrowRight size={15} />
            </Link>
          </div>
        </Fade>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#020617', borderTop: '1px solid #1e293b', padding: isMobile ? '20px 16px' : '28px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#fff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={14} color="#020617" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>Yuristim</span>
            <span style={{ fontSize: 9, fontWeight: 700, background: '#14532d', color: '#4ade80', padding: '2px 7px', borderRadius: 4 }}>BETA</span>
          </div>
          {!isMobile && <p style={{ color: '#475569', fontSize: 12 }}>© 2026 Yuristim. Barcha huquqlar himoyalangan.</p>}
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12.5, textDecoration: 'none' }}>
              <Send size={12} /> Telegram
            </a>
            <a href="mailto:diyorbeknematov07@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12.5, textDecoration: 'none' }}>
              <Mail size={12} /> Email
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)} }
      `}</style>
    </div>
  )
}
