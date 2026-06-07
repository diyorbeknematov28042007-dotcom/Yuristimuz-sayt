'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Scale, Search, MessageCircle, FileText, MapPin, Bot, CheckCircle2,
  ArrowRight, Shield, Users, Mail, Send, Sparkles, Building2,
  TrendingUp, Lock, Globe, Briefcase, BadgeCheck, Zap, Crown,
  ChevronRight, Phone, Award, X, Menu
} from 'lucide-react'

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

function Fade({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.7s ${delay}ms cubic-bezier(.4,0,.2,1), transform 0.7s ${delay}ms cubic-bezier(.4,0,.2,1)`,
    }}>
      {children}
    </div>
  )
}

function useCountUp(target: number, duration = 2000, start = false) {
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
  { icon: <Users size={20} />, label: 'Oilaviy huquq', bg: '#fef2f2', color: '#991b1b' },
  { icon: <Building2 size={20} />, label: 'Biznes huquqi', bg: '#eff6ff', color: '#1d4ed8' },
  { icon: <MapPin size={20} />, label: 'Mulk huquqi', bg: '#f0fdf4', color: '#166534' },
  { icon: <Briefcase size={20} />, label: 'Mehnat huquqi', bg: '#fff7ed', color: '#c2410c' },
  { icon: <TrendingUp size={20} />, label: 'Soliq huquqi', bg: '#fefce8', color: '#854d0e' },
  { icon: <Lock size={20} />, label: 'Jinoyat huquqi', bg: '#fef2f2', color: '#991b1b' },
  { icon: <FileText size={20} />, label: 'Shartnomalar', bg: '#faf5ff', color: '#7e22ce' },
  { icon: <Globe size={20} />, label: 'Migratsiya', bg: '#f0fdfa', color: '#134e4a' },
]

const steps = [
  { num: '01', icon: <FileText size={22} />, title: "Elon qo'ying", desc: "Huquqiy muammongizni batafsil yozing — bepul va tez", color: '#eff6ff', iconColor: '#1d4ed8' },
  { num: '02', icon: <Search size={22} />, title: 'Yurist toping', desc: "Soha, reyting va joylashuv bo'yicha filtrlang", color: '#f0fdf4', iconColor: '#166534' },
  { num: '03', icon: <MessageCircle size={22} />, title: "Bog'laning", desc: "Real-time chat orqali darhol muloqot qiling", color: '#faf5ff', iconColor: '#7e22ce' },
  { num: '04', icon: <CheckCircle2 size={22} />, title: 'Natija oling', desc: "Professional yordam bilan muammoni yechin", color: '#fff7ed', iconColor: '#c2410c' },
]

const features = [
  { icon: <Search size={22} />, title: 'Aqlli qidiruv', desc: "Soha, tajriba va joylashuv bo'yicha filtrlang. Kerakli yuristni daqiqada toping.", bg: '#eff6ff', color: '#1d4ed8' },
  { icon: <MessageCircle size={22} />, title: 'Real-time chat', desc: "Yurist bilan platformada to'g'ridan-to'g'ri gaplashing. Tarix saqlanadi.", bg: '#f0fdf4', color: '#166534' },
  { icon: <Bot size={22} />, title: 'AI huquqiy maslahat', desc: "Sun'iy intellekt yordamida oddiy savollarga darhol javob.", bg: '#faf5ff', color: '#7e22ce' },
  { icon: <FileText size={22} />, title: 'Hujjat generatsiya', desc: "AI yordamida shartnoma va ariza tuzing — bir necha daqiqada.", bg: '#fff7ed', color: '#c2410c' },
  { icon: <MapPin size={22} />, title: 'Advokatura xaritasi', desc: "Yandex Maps orqali yaqin atrofdagi advokatlarni toping.", bg: '#f0fdfa', color: '#134e4a' },
  { icon: <Shield size={22} />, title: "Xavfsiz to'lov", desc: "Payme va Click orqali xavfsiz to'lov. Pul qaytarish kafolati.", bg: '#fef2f2', color: '#991b1b' },
]

const phases = [
  {
    phase: 'Faza 1', title: 'Beta — Hozir',
    badge: 'BEPUL', badgeBg: '#dcfce7', badgeColor: '#166534',
    accent: true,
    items: [
      'Platforma to\'liq bepul',
      'Yuristlar bilan chat',
      'Elon joylash va ko\'rish',
      'Yurist profillari',
      'Asosiy qidiruv va filtr',
    ],
    note: 'Beta davri — barcha xizmatlar bepul',
    icon: <Sparkles size={16} />,
  },
  {
    phase: 'Faza 2', title: 'Pro — 2026 Q3',
    badge: 'KELAYOTGAN', badgeBg: '#eff6ff', badgeColor: '#1d4ed8',
    items: [
      "Yuristlar uchun Pro tarif",
      "Payme va Click to'lov",
      "Kredit tizimi",
      "Advokatura xaritasi",
      "Profil statistikasi",
    ],
    note: "Mijozlar uchun asosiy xizmatlar bepul",
    icon: <Zap size={16} />,
  },
  {
    phase: 'Faza 3', title: 'Full — 2027',
    badge: 'KELAJAK', badgeBg: '#faf5ff', badgeColor: '#7e22ce',
    items: [
      'AI huquqiy chatbot',
      'Hujjat generatsiyasi (PDF)',
      'Zoom konsultatsiya',
      'Yurist workspace',
      'Mobil ilova (iOS/Android)',
    ],
    note: "To'liq legal-tech ekotizimi",
    icon: <Crown size={16} />,
  },
]

const founders = [
  {
    initials: 'DN', name: 'Diyorbek Nematov', role: 'Founder & CEO',
    desc: "Huquq talabasi va legal-tech tadbirkor. O'zbekistonda huquqiy xizmatlarni raqamlashtirish missiyasi.",
    badge: 'CEO',
    isFounder: true,
    telegram: 'https://t.me/lawyer_nematov',
    email: 'diyorbeknematov07@gmail.com',
    handle: '@lawyer_nematov',
  },
  {
    initials: '?', name: 'Texnik Co-founder', role: 'CTO',
    desc: "Full-stack developer izlanmoqda. React, Node.js, Supabase tajribasi. Equity + maosh.",
    isVacancy: true,
  },
  {
    initials: '?', name: 'Marketing Co-founder', role: 'CMO',
    desc: "Digital marketing va SMM mutaxassisi izlanmoqda. O'zbekiston bozorini biluvchi.",
    isVacancy: true,
  },
]

export default function HomePage() {
  const [started, setStarted] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { ref: statsRef, inView: statsInView } = useInView()
  const lawyers = useCountUp(500, 2000, statsInView)
  const ads = useCountUp(1200, 2000, statsInView)
  const regions = useCountUp(14, 1400, statsInView)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
      color: '#0f172a',
    }}>

      {/* NAVBAR */}
      <header style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid #e2e8f0',
        position: 'sticky', top: 0, zIndex: 50,
        opacity: started ? 1 : 0,
        transform: started ? 'translateY(0)' : 'translateY(-16px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: '#0f172a', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(15,23,42,0.15)' }}>
              <Scale size={17} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, color: '#0f172a', letterSpacing: '-0.4px' }}>Yuristim</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: '#dcfce7', color: '#166534', padding: '2px 7px', borderRadius: 4, letterSpacing: '0.5px', marginLeft: 2 }}>BETA</span>
          </div>

          <nav style={{ display: 'none', gap: 28, alignItems: 'center' }} className="hidden md:flex">
            {[['Xizmatlar', '#xizmatlar'], ['Jarayon', '#jarayon'], ['Fazalar', '#fazalar'], ['Jamoa', '#jamoa']].map(([label, href]) => (
              <a key={href} href={href} style={{ fontSize: 13.5, fontWeight: 500, color: '#475569', textDecoration: 'none', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0f172a'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}>
                {label}
              </a>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Link href="/auth/login" style={{ fontSize: 13.5, fontWeight: 600, color: '#475569', textDecoration: 'none', padding: '8px 14px', borderRadius: 8 }}>
              Kirish
            </Link>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 600, background: '#0f172a', color: '#fff', padding: '9px 18px', borderRadius: 9, textDecoration: 'none', boxShadow: '0 2px 8px rgba(15,23,42,0.2)' }}>
              Boshlash <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(67,56,202,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            opacity: started ? 1 : 0,
            transform: started ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s 0.1s ease',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '0.5px solid #e2e8f0', padding: '6px 16px', borderRadius: 100, marginBottom: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#475569', letterSpacing: '0.1px' }}>Beta versiyada · Hozir bepul</span>
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: 20,
            letterSpacing: '-2px',
            color: '#0f172a',
            opacity: started ? 1 : 0,
            transform: started ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.7s 0.2s ease',
          }}>
            Huquqiy yordam<br />
            <span style={{ background: 'linear-gradient(135deg, #0f172a 0%, #4338ca 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              bir bosishda
            </span>
          </h1>

          <p style={{
            fontSize: 17, color: '#64748b', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 36px',
            opacity: started ? 1 : 0,
            transform: started ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s 0.3s ease',
          }}>
            O'zbekistondagi birinchi raqamli huquqiy platforma. Tajribali yuristlar, tezkor yechim.
          </p>

          <div style={{
            display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56,
            opacity: started ? 1 : 0,
            transform: started ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.7s 0.4s ease',
          }}>
            <Link href="/auth/signup?role=client" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: 15, padding: '13px 26px', borderRadius: 11, textDecoration: 'none', boxShadow: '0 4px 14px rgba(15,23,42,0.25)', transition: 'all 200ms' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(15,23,42,0.3)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(15,23,42,0.25)' }}>
              Yurist topish <ArrowRight size={15} />
            </Link>
            <Link href="/auth/signup?role=lawyer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0f172a', fontWeight: 600, fontSize: 15, padding: '13px 26px', borderRadius: 11, textDecoration: 'none', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <Briefcase size={15} /> Yurist sifatida kirish
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{
            display: 'inline-grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
            padding: '18px 32px', background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            opacity: started ? 1 : 0,
            transition: 'opacity 0.7s 0.55s ease',
          }}>
            {[
              { value: lawyers, suffix: '+', label: 'Yuristlar' },
              { value: ads, suffix: '+', label: 'Elonlar' },
              { value: regions, suffix: '', label: 'Viloyat' },
            ].map((s, i) => (
              <div key={s.label} style={{ textAlign: 'left', padding: '0 24px', borderLeft: i > 0 ? '0.5px solid #e2e8f0' : 'none' }}>
                <div style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', letterSpacing: '-1.2px', lineHeight: 1 }}>
                  {s.value}<span style={{ color: '#4338ca' }}>{s.suffix}</span>
                </div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALIZATIONS */}
      <section style={{ padding: '64px 24px', background: '#fafafa', borderTop: '0.5px solid #f1f5f9' }} id="xizmatlar">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>Sohalar</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 12 }}>Har bir holatga mutaxassis</h2>
              <p style={{ color: '#64748b', fontSize: 15 }}>Qaysi huquqiy masala bo'lmasin — platformamizda tajribali yurist bor</p>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {specializations.map((s, i) => (
              <Fade key={s.label} delay={i * 40}>
                <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 200ms' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0f172a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(15,23,42,0.08)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                  <div style={{ width: 44, height: 44, background: s.bg, color: s.color, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
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
      <section style={{ padding: '72px 24px', background: '#fff' }} id="jarayon">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>Jarayon</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px' }}>Qanday ishlaydi?</h2>
              <p style={{ color: '#64748b', marginTop: 12, fontSize: 15 }}>4 oddiy qadamda huquqiy muammoni yechin</p>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {steps.map((step, i) => (
              <Fade key={step.num} delay={i * 80}>
                <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: 24, height: '100%', position: 'relative', transition: 'all 200ms' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0f172a' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.1em', marginBottom: 14, fontFamily: 'ui-monospace, monospace' }}>{step.num}</div>
                  <div style={{ width: 48, height: 48, background: step.color, color: step.iconColor, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
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
      <section style={{ padding: '72px 24px', background: '#fafafa', borderTop: '0.5px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>Imkoniyatlar</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px' }}>Nima uchun Yuristim?</h2>
              <p style={{ color: '#64748b', marginTop: 12, fontSize: 15 }}>Bir platformada barcha huquqiy xizmatlar</p>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {features.map((f, i) => (
              <Fade key={f.title} delay={i * 60}>
                <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: 26, height: '100%', transition: 'all 200ms' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0f172a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(15,23,42,0.06)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                  <div style={{ width: 48, height: 48, background: f.bg, color: f.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 8, fontSize: 16 }}>{f.title}</h3>
                  <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* PHASES */}
      <section style={{ padding: '72px 24px', background: '#fff' }} id="fazalar">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>Rivojlanish yo'l xaritasi</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 12 }}>Platforma fazalari</h2>
              <p style={{ color: '#64748b', maxWidth: 500, margin: '0 auto', fontSize: 15 }}>Hozir Beta versiyamiz to'liq bepul. Kelajakda qo'shiladigan xizmatlar:</p>
            </div>
          </Fade>

          <Fade>
            <div style={{ background: '#0f172a', borderRadius: 16, padding: '22px 28px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 18, color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: 48, height: 48, background: 'rgba(34,197,94,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={22} color="#4ade80" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Hozir Beta versiyada — hammasi BEPUL</p>
                <p style={{ fontSize: 13, color: '#94a3b8' }}>Platforma rivojlanish bosqichida. Sizning fikr va takliflaringiz bizga juda muhim.</p>
              </div>
              <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#22c55e', color: '#fff', fontWeight: 600, fontSize: 13.5, padding: '10px 20px', borderRadius: 10, textDecoration: 'none', flexShrink: 0 }}>
                Bepul kirish <ArrowRight size={13} />
              </Link>
            </div>
          </Fade>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {phases.map((phase, i) => (
              <Fade key={phase.phase} delay={i * 80}>
                <div style={{
                  border: phase.accent ? '1.5px solid #0f172a' : '0.5px solid #e2e8f0',
                  borderRadius: 18, padding: 24, background: '#fff', height: '100%', display: 'flex', flexDirection: 'column',
                  boxShadow: phase.accent ? '0 8px 24px rgba(15,23,42,0.08)' : 'none',
                  position: 'relative',
                }}>
                  {phase.accent && (
                    <div style={{ position: 'absolute', top: -10, left: 20, background: '#0f172a', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 5, letterSpacing: '0.5px' }}>
                      HOZIR FAOL
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
                      {phase.icon}
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' }}>{phase.phase}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, background: phase.badgeBg, color: phase.badgeColor, padding: '3px 9px', borderRadius: 5, letterSpacing: '0.5px' }}>
                      {phase.badge}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: 18, marginBottom: 16, letterSpacing: '-0.3px' }}>{phase.title}</h3>
                  <div style={{ flex: 1 }}>
                    {phase.items.map(item => (
                      <div key={item} style={{ fontSize: 13, color: '#475569', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 }}>
                        <CheckCircle2 size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '0.5px solid #f1f5f9' }}>
                    <p style={{ fontSize: 11.5, color: '#94a3b8', fontStyle: 'italic' }}>{phase.note}</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* FOR LAWYERS */}
      <section style={{ padding: '80px 24px', background: '#0f172a', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(67,56,202,0.3) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(67,56,202,0.2) 0%, transparent 60%)' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Fade>
            <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Scale size={28} color="#fff" />
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: '-0.8px' }}>Yuristmisiz?</h2>
            <p style={{ color: '#94a3b8', fontSize: 17, marginBottom: 36, lineHeight: 1.6, maxWidth: 540, margin: '0 auto 36px' }}>
              14 kun bepul sinab ko'ring. Yangi mijozlar toping, elon joylang va biznesingizni rivojlantiring.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, maxWidth: 540, margin: '0 auto 36px' }}>
              {[
                { icon: <Users size={20} />, text: 'Maqsadli mijozlar' },
                { icon: <TrendingUp size={20} />, text: 'Profil statistikasi' },
                { icon: <Briefcase size={20} />, text: 'Workspace' },
              ].map(item => (
                <div key={item.text} style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '18px 12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', color: '#a5b4fc', marginBottom: 8 }}>{item.icon}</div>
                  <p style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/signup?role=lawyer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0f172a', fontWeight: 700, fontSize: 15, padding: '15px 32px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
              Bepul boshlash <ArrowRight size={15} />
            </Link>
          </Fade>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ padding: '72px 24px', background: '#fff' }} id="jamoa">
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>Jamoa</p>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px', marginBottom: 12 }}>Founders</h2>
              <p style={{ color: '#64748b', fontSize: 15 }}>Co-founder vakansiyalari ochiq — qiziqsangiz bog'laning</p>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {founders.map((f, i) => (
              <Fade key={f.name} delay={i * 80}>
                <div style={{
                  border: f.isFounder ? '1.5px solid #0f172a' : '1.5px dashed #cbd5e1',
                  borderRadius: 18, padding: 24, background: f.isFounder ? '#fff' : '#fafafa',
                  height: '100%', display: 'flex', flexDirection: 'column',
                  boxShadow: f.isFounder ? '0 8px 24px rgba(15,23,42,0.08)' : 'none',
                  position: 'relative', transition: 'all 200ms',
                }}>
                  {f.isFounder && (
                    <div style={{ position: 'absolute', top: -10, right: 20, background: '#0f172a', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 5, letterSpacing: '0.5px' }}>
                      {f.badge}
                    </div>
                  )}
                  {f.isVacancy && (
                    <div style={{ position: 'absolute', top: -10, right: 20, background: '#fff7ed', color: '#c2410c', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 5, letterSpacing: '0.5px', border: '0.5px solid #fed7aa' }}>
                      OCHIQ VAKANSIYA
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 52, height: 52,
                      background: f.isFounder ? 'linear-gradient(135deg,#0f172a,#4338ca)' : '#f1f5f9',
                      color: f.isFounder ? '#fff' : '#94a3b8',
                      borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', flexShrink: 0,
                    }}>
                      {f.isVacancy ? <Users size={22} /> : f.initials}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: f.isVacancy ? '#475569' : '#0f172a', fontSize: 15, marginBottom: 2 }}>{f.name}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{f.role}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 18, flex: 1 }}>{f.desc}</p>

                  {f.isFounder && (
                    <div style={{ paddingTop: 14, borderTop: '0.5px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <a href={f.telegram} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#4338ca', textDecoration: 'none', fontWeight: 600 }}>
                        <span style={{ width: 30, height: 30, background: '#eef2ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Send size={14} color="#4338ca" />
                        </span>
                        {f.handle}
                      </a>
                      <a href={`mailto:${f.email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#475569', textDecoration: 'none', fontWeight: 500 }}>
                        <span style={{ width: 30, height: 30, background: '#f1f5f9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Mail size={14} color="#64748b" />
                        </span>
                        <span style={{ fontSize: 12 }}>{f.email}</span>
                      </a>
                    </div>
                  )}

                  {f.isVacancy && (
                    <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff7ed', color: '#c2410c', fontWeight: 600, fontSize: 13, padding: '11px', borderRadius: 11, textDecoration: 'none', border: '0.5px solid #fed7aa' }}>
                      <Send size={14} /> Murojaat qilish
                    </a>
                  )}
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: '64px 24px', background: '#fafafa', borderTop: '0.5px solid #f1f5f9' }} id="aloqa">
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <Fade>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10 }}>Aloqa</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.6px', marginBottom: 12 }}>Bog'laning</h2>
            <p style={{ color: '#64748b', marginBottom: 32, fontSize: 15 }}>Savol, taklif yoki hamkorlik uchun murojaat qiling</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: 14, padding: '13px 24px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
                <Send size={16} /> Telegram
              </a>
              <a href="mailto:diyorbeknematov07@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: '#0f172a', fontWeight: 600, fontSize: 14, padding: '13px 24px', borderRadius: 12, textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                <Mail size={16} /> Email
              </a>
            </div>
          </Fade>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: '#020617', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(67,56,202,0.15) 0%, transparent 60%)' }} />
        <Fade>
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg,#4338ca,#6366f1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 8px 24px rgba(67,56,202,0.4)' }}>
              <Scale size={26} color="#fff" />
            </div>
            <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: '-0.8px' }}>Bugunoq boshlang</h2>
            <p style={{ color: '#94a3b8', marginBottom: 8, fontSize: 16 }}>Beta versiya — barcha xizmatlar bepul</p>
            <p style={{ color: '#475569', marginBottom: 36, fontSize: 13.5 }}>Ro'yxatdan o'tish 1 daqiqa. Hech qanday karta kerak emas.</p>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0f172a', fontWeight: 700, fontSize: 15, padding: '15px 32px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 32px rgba(255,255,255,0.15)' }}>
              Bepul ro'yxatdan o'tish <ArrowRight size={15} />
            </Link>
          </div>
        </Fade>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#020617', borderTop: '1px solid #1e293b', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={15} color="#020617" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>Yuristim</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: '#14532d', color: '#4ade80', padding: '2px 7px', borderRadius: 4, letterSpacing: '0.5px' }}>BETA</span>
          </div>
          <p style={{ color: '#475569', fontSize: 12 }}>© 2026 Yuristim. Barcha huquqlar himoyalangan.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12.5, textDecoration: 'none', fontWeight: 500 }}>
              <Send size={13} /> Telegram
            </a>
            <a href="mailto:diyorbeknematov07@gmail.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12.5, textDecoration: 'none', fontWeight: 500 }}>
              <Mail size={13} /> Email
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}
