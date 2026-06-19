'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Scale, Search, MessageCircle, FileText, MapPin,
  CheckCircle2, ArrowRight, Shield, Users, Mail, Send, Instagram,
  Sparkles, Building2, TrendingUp, Lock, Globe, Briefcase,
  Clock, BookOpen, Menu, X, Star
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
]

const steps = [
  { num: '01', icon: <FileText size={20} />, title: "Murojaat yuboring", desc: "Huquqiy vaziyatni qisqacha yozing", color: '#eff6ff', icolor: '#1d4ed8' },
  { num: '02', icon: <Search size={20} />, title: 'Yurist tanlang', desc: "Soha, shahar va reytingga qarab", color: '#f0fdf4', icolor: '#166534' },
  { num: '03', icon: <MessageCircle size={20} />, title: "To'g'ridan gaplashing", desc: "Platforma orqali bevosita chat", color: '#faf5ff', icolor: '#7e22ce' },
  { num: '04', icon: <CheckCircle2 size={20} />, title: 'Yechim oling', desc: "Professional huquqiy yordam", color: '#fff7ed', icolor: '#c2410c' },
]

const features = [
  { icon: <MapPin size={20} />, title: 'Yuristlar xaritasi', desc: "Yaqin atrofdagi ishonchli yuristlarni xaritada toping", bg: '#eff6ff', c: '#1d4ed8' },
  { icon: <MessageCircle size={20} />, title: 'Bevosita muloqot', desc: "Yurist bilan platformada to'g'ridan-to'g'ri yozishing", bg: '#f0fdf4', c: '#166534' },
  { icon: <Sparkles size={20} />, title: 'AI yuridik maslahat', desc: "Sun'iy intellektdan boshlang'ich yo'nalish va javob oling", bg: '#faf5ff', c: '#7e22ce' },
  { icon: <Shield size={20} />, title: 'Tasdiqlangan yuristlar', desc: "Har bir yurist tekshiruvdan o'tadi — shaffof reyting va sharhlar", bg: '#fef2f2', c: '#991b1b' },
  { icon: <BookOpen size={20} />, title: 'Bilim manbalari', desc: "Yuridik adabiyotlar, maqolalar va qonunchilik bazasi", bg: '#f0fdfa', c: '#134e4a' },
  { icon: <FileText size={20} />, title: "Huquqiy e'lonlar", desc: "Xizmat izlang yoki o'z e'loningizni bepul joylashtiring", bg: '#fff7ed', c: '#c2410c' },
]

const phases = [
  {
    phase: 'Hozir mavjud', title: 'Bugun foydalanishingiz mumkin', badge: 'FAOL', badgeBg: '#dcfce7', badgeC: '#166534', accent: true, icon: <CheckCircle2 size={14} />,
    items: [
      "Yuristlar xaritasi va qidiruv",
      "Yurist bilan bevosita muloqot",
      "AI yuridik maslahatchi (beta)",
      "Huquqiy e'lonlar",
      "Bilim manbalari va yangiliklar",
    ],
    note: 'Barchasi hoziroq, ortiqcha to\'lovsiz'
  },
  {
    phase: 'Tez orada', title: 'Yangi imkoniyatlar', badge: '2-BOSQICH', badgeBg: '#eff6ff', badgeC: '#1d4ed8', icon: <Clock size={14} />,
    items: [
      "Sun'iy intellekt bilan hujjat tuzish",
      "Yuristlar uchun maxsus tariflar",
      "Profil statistikasi",
      "Mobil ilova",
    ],
    note: "Mijozlar uchun asosiy xizmatlar bepulligicha qoladi"
  },
  {
    phase: 'Kelajakda', title: "To'liq huquqiy ekotizim", badge: '3-BOSQICH', badgeBg: '#faf5ff', badgeC: '#7e22ce', icon: <Sparkles size={14} />,
    items: [
      "Online video konsultatsiya",
      "Yuristlarni o'qitish tizimi",
      "Kengaytirilgan AI imkoniyatlari",
      "Yangi hamkorliklar",
    ],
    note: "Yuristlar va mijozlar uchun keng imkoniyatlar"
  },
]

// ── Asoschi ma'lumoti ──
const founder = {
  ini: 'DN',
  name: 'Diyorbek Nematov',
  role: 'Asoschi va rahbar',
  // Rasm: /public ga rasm qo'ysangiz, shu yerga fayl nomini yozing (masalan '/founder.jpg').
  // Bo'sh qoldirilsa — ism harflari (DN) ko'rsatiladi.
  photo: '',
  desc: "Huquqshunos va raqamli xizmatlar tadbirkori. Maqsadim — O'zbekistonda sifatli huquqiy yordamni har bir inson uchun ochiq, tushunarli va arzon qilish.",
  telegram: 'https://t.me/yuristim_online',
  instagram: 'https://www.instagram.com/yuristim.online?igsh=MWh6d2hueTVpcXUxdg%3D%3D&utm_source=qr',
  email: 'diyorbeknematov07@gmail.com',
}

// ── Nega aynan Yuristim? (ustunliklar) ──
const whyUs = [
  { icon: <Shield size={22} />, title: 'Tasdiqlangan yuristlar', desc: "Har bir mutaxassis ma'muriyat tomonidan tekshiriladi. Faqat ishonchli yuristlar bilan ishlaysiz.", bg: '#eff6ff', c: '#1d4ed8' },
  { icon: <MessageCircle size={22} />, title: 'Vositachisiz aloqa', desc: "Yurist bilan to'g'ridan-to'g'ri yozishasiz. Ortiqcha to'lov, vositachi yoki kechikish yo'q.", bg: '#f0fdf4', c: '#166534' },
  { icon: <Sparkles size={22} />, title: 'AI 24/7 yoningizda', desc: "Sun'iy intellekt istalgan vaqtda boshlang'ich yo'nalish va javob beradi.", bg: '#faf5ff', c: '#7e22ce' },
  { icon: <Globe size={22} />, title: "O'zbekiston uchun", desc: "Mahalliy qonunchilik asosida, o'zbek tilida. Bizning huquqiy tizimimizga moslangan.", bg: '#fff7ed', c: '#c2410c' },
]

// ── Bizga qo'shiling (ochiq o'rinlar) ──
const openRoles = [
  {
    ini: 'MI',
    title: 'Mentor va investor',
    role: 'Strategik hamkor',
    desc: "Yuridik yoki texnologiya sohasida tajribali mentor va investor izlanmoqda. Birgalikda O'zbekiston huquqiy bozorini rivojlantiramiz.",
    tags: ['Startap tajribasi', 'Investitsiya', "Yo'nalish"],
  },
  {
    ini: 'MK',
    title: 'Marketing mutaxassisi',
    role: "Kontent va o'sish",
    desc: "O'zbekiston raqamli bozorini yaxshi biladigan, ijtimoiy tarmoqlarda tajribali marketing mutaxassisi kerak.",
    tags: ['SMM', 'Kontent', 'Raqamli marketing'],
  },
]

// ── Main Component ─────────────────────────────────────
export default function HomePage() {
  const isMobile = useIsMobile()
  const [started, setStarted] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const { ref: statsRef, inView: statsInView } = useInView()
  const regions = useCountUp(14, 1400, statsInView)
  const sohalar = useCountUp(8, 1200, statsInView)

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
              {[['Nega biz', '#nega-biz'], ['Imkoniyatlar', '#imkoniyatlar'], ['Rejalar', '#fazalar'], ['Biz haqimizda', '#jamoa']].map(([label, href]) => (
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
            {[['Nega biz', '#nega-biz'], ['Imkoniyatlar', '#imkoniyatlar'], ['Rejalar', '#fazalar'], ['Biz haqimizda', '#jamoa']].map(([label, href]) => (
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
              <span style={{ fontSize: isMobile ? 11 : 12, fontWeight: 600, color: '#475569' }}>O'zbekiston uchun · Tasdiqlangan yuristlar</span>
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
          <p style={{ fontSize: isMobile ? 14 : 17, color: '#64748b', lineHeight: 1.65, maxWidth: 520, margin: `0 auto ${isMobile ? '28px' : '36px'}`, opacity: started ? 1 : 0, transform: started ? 'none' : 'translateY(18px)', transition: 'all .65s .3s ease' }}>
            Ishonchli yuristni toping, bevosita yozishing va huquqiy savollaringizga javob oling. Sun'iy intellekt esa 24/7 yoningizda — boshlang'ich maslahat bir necha soniyada.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: isMobile ? 14 : 18, opacity: started ? 1 : 0, transform: started ? 'none' : 'translateY(14px)', transition: 'all .65s .4s ease' }}>
            <Link href="/auth/signup?role=client" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: isMobile ? 14 : 15, padding: isMobile ? '12px 22px' : '13px 26px', borderRadius: 11, textDecoration: 'none', boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}>
              Yurist topish <ArrowRight size={14} />
            </Link>
            <Link href="/auth/signup?role=lawyer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#0f172a', fontWeight: 700, fontSize: isMobile ? 14 : 15, padding: isMobile ? '12px 22px' : '13px 26px', borderRadius: 11, textDecoration: 'none', border: '1px solid #e2e8f0' }}>
              <Briefcase size={14} /> Yurist bo'ling
            </Link>
          </div>

          {/* Ishonch micro-signal */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: isMobile ? 36 : 52, opacity: started ? 1 : 0, transition: 'opacity .65s .5s ease' }}>
            {['1 daqiqada ro\'yxat', 'Kredit karta kerak emas', 'Hoziroq bepul'].map((t, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: isMobile ? 11 : 12.5, color: '#94a3b8' }}>
                <CheckCircle2 size={13} color="#22c55e" /> {t}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{ display: 'inline-grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, padding: isMobile ? '14px 20px' : '18px 32px', background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', opacity: started ? 1 : 0, transition: 'opacity .7s .55s ease' }}>
            {[{ value: regions, suffix: '', label: 'Viloyat' }, { value: sohalar, suffix: '+', label: 'Huquqiy soha' }, { value: 24, suffix: '/7', label: 'AI maslahat' }].map((s, i) => (
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
              <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 8 }}>Qaysi sohada yordam kerak?</h2>
              {!isMobile && <p style={{ color: '#64748b', fontSize: 15 }}>Oilaviy nizolardan biznes huquqigacha — har bir masalaga mutaxassis topasiz</p>}
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 8 : 12 }}>
            {specs.map((s, i) => (
              <Fade key={s.label} delay={i * 40}>
                <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: isMobile ? 12 : 14, padding: isMobile ? '12px 6px' : '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 200ms' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0f172a'; el.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e2e8f0'; el.style.transform = 'translateY(0)' }}>
                  <div style={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, background: s.bg, color: s.color, borderRadius: isMobile ? 10 : 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', marginBottom: isMobile ? 6 : 12 }}>
                    {isMobile ? <span style={{ fontSize: 16 }}>{[<Users />, <Building2 />, <MapPin />, <Briefcase />, <TrendingUp />, <Lock />, <FileText />][i]}</span> : s.icon}
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

      {/* ── WHY US (Nega aynan Yuristim?) ── */}
      <section style={{ padding: sp, background: '#fff' }} id="nega-biz">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 44 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Nega aynan biz</p>
              <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 10 }}>Nega aynan Yuristim?</h2>
              <p style={{ color: '#64748b', fontSize: isMobile ? 13 : 15, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
                Huquqiy yordamni soddalashtiramiz — ishonchli, tezkor va hamma uchun ochiq
              </p>
            </div>
          </Fade>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 10 : 16 }}>
            {whyUs.map((w, i) => (
              <Fade key={w.title} delay={i * 60}>
                <div style={{ background: '#fafafa', border: '0.5px solid #e2e8f0', borderRadius: 18, padding: isMobile ? '18px' : '24px', display: 'flex', alignItems: 'flex-start', gap: 16, height: '100%', transition: 'all 200ms' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0f172a'; el.style.background = '#fff' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e2e8f0'; el.style.background = '#fafafa' }}>
                  <div style={{ width: 50, height: 50, background: w.bg, color: w.c, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {w.icon}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 5, fontSize: isMobile ? 15 : 16.5 }}>{w.title}</h3>
                    <p style={{ fontSize: isMobile ? 12.5 : 13.5, color: '#64748b', lineHeight: 1.65 }}>{w.desc}</p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: sp, background: '#fafafa', borderTop: '0.5px solid #f1f5f9' }} id="imkoniyatlar">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 44 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Imkoniyatlar</p>
              <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Sizga nima beramiz?</h2>
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
              <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Rivojlanish</p>
              <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Hozir va kelajakda</h2>
            </div>
          </Fade>

          <Fade>
            <div style={{ background: '#0f172a', borderRadius: 16, padding: isMobile ? '16px' : '20px 24px', marginBottom: isMobile ? 16 : 22, display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.08)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={20} color="#4ade80" />
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontWeight: 700, color: '#fff', fontSize: isMobile ? 14 : 15, marginBottom: 3 }}>Platforma faol rivojlanmoqda</p>
                <p style={{ fontSize: isMobile ? 12 : 13, color: '#94a3b8' }}>Yangi imkoniyatlar muntazam qo'shilib boradi. Fikr va takliflaringiz biz uchun qadrli.</p>
              </div>
              <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#22c55e', color: '#fff', fontWeight: 600, fontSize: 13, padding: '10px 18px', borderRadius: 10, textDecoration: 'none', flexShrink: 0 }}>
                Hoziroq boshlash <ArrowRight size={13} />
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
            <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.08)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Scale size={30} color="#a5b4fc" strokeWidth={2} />
            </div>
            <h2 style={{ fontSize: isMobile ? 28 : 38, fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: '-0.5px' }}>Siz yuristmisiz?</h2>
            <p style={{ color: '#94a3b8', fontSize: isMobile ? 14 : 16, marginBottom: 28, lineHeight: 1.65, maxWidth: 480, margin: `0 auto ${isMobile ? '24px' : '32px'}` }}>
              Bepul profil yarating, xizmatlaringizni ko'rsating va yangi mijozlarga yeting. Yuristim sizni izlayotgan mijozlar bilan bog'laydi.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 480, margin: `0 auto ${isMobile ? '24px' : '30px'}` }}>
              {[{ icon: <Users size={18} />, text: 'Yangi mijozlar' }, { icon: <Star size={18} />, text: 'Reyting va obro\'' }, { icon: <MessageCircle size={18} />, text: 'Bevosita aloqa' }].map(item => (
                <div key={item.text} style={{ background: 'rgba(255,255,255,0.07)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: isMobile ? '12px 8px' : '16px 10px', textAlign: 'center' }}>
                  <div style={{ color: '#a5b4fc', marginBottom: 7, display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                  <p style={{ fontSize: isMobile ? 10 : 12, color: '#e2e8f0', fontWeight: 500 }}>{item.text}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/signup?role=lawyer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#0f172a', fontWeight: 700, fontSize: isMobile ? 14 : 15, padding: isMobile ? '13px 24px' : '15px 30px', borderRadius: 12, textDecoration: 'none' }}>
              Yurist sifatida boshlash <ArrowRight size={15} />
            </Link>
          </Fade>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: sp, background: '#fff' }} id="jamoa">
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <Fade>
            <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 36 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Biz haqimizda</p>
              <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Platforma ortidagi inson</h2>
              <p style={{ color: '#64748b', marginTop: 10, fontSize: isMobile ? 13 : 15, lineHeight: 1.65, maxWidth: 520, margin: '10px auto 0' }}>
                Yuristim — O'zbekistonda huquqiy yordamni raqamlashtirish va har bir insonga ochiq qilish missiyasi bilan yaratilgan.
              </p>
            </div>
          </Fade>

          <Fade>
            {/* Asoschi kartasi */}
            <div style={{ border: '1.5px solid #0f172a', borderRadius: 20, padding: isMobile ? 22 : 32, background: '#fff', boxShadow: '0 4px 20px rgba(15,23,42,0.07)', textAlign: 'center' }}>
              {/* Avatar — rasm yoki inicial */}
              <div style={{ width: isMobile ? 88 : 104, height: isMobile ? 88 : 104, borderRadius: '50%', margin: '0 auto 18px', overflow: 'hidden', border: '3px solid #f1f5f9', boxShadow: '0 4px 14px rgba(15,23,42,0.12)' }}>
                {founder.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={founder.photo} alt={founder.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: isMobile ? 30 : 36 }}>
                    {founder.ini}
                  </div>
                )}
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#0f172a', color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '4px 12px', borderRadius: 5, letterSpacing: '0.5px', marginBottom: 12 }}>
                ASOSCHI
              </div>

              <h3 style={{ fontWeight: 800, color: '#0f172a', fontSize: isMobile ? 19 : 22, letterSpacing: '-0.3px', marginBottom: 4 }}>{founder.name}</h3>
              <p style={{ fontSize: isMobile ? 12.5 : 13.5, color: '#4338ca', fontWeight: 600, marginBottom: 16 }}>{founder.role}</p>

              <p style={{ fontSize: isMobile ? 13 : 14.5, color: '#475569', lineHeight: 1.75, maxWidth: 460, margin: '0 auto 22px' }}>
                {founder.desc}
              </p>

              {/* Aloqa tugmalari */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', paddingTop: 20, borderTop: '0.5px solid #f1f5f9' }}>
                <a href={founder.telegram} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#0f172a', color: '#fff', fontSize: 12.5, fontWeight: 600, padding: '9px 16px', borderRadius: 10, textDecoration: 'none' }}>
                  <Send size={13} /> Telegram
                </a>
                <a href={founder.instagram} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#0f172a', fontSize: 12.5, fontWeight: 600, padding: '9px 16px', borderRadius: 10, textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                  <Instagram size={13} /> Instagram
                </a>
                <a href={`mailto:${founder.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#0f172a', fontSize: 12.5, fontWeight: 600, padding: '9px 16px', borderRadius: 10, textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                  <Mail size={13} /> Email
                </a>
              </div>
            </div>
          </Fade>

          {/* Bizga qo'shiling — ochiq o'rinlar */}
          <Fade>
            <div style={{ marginTop: isMobile ? 32 : 44 }}>
              <div style={{ textAlign: 'center', marginBottom: isMobile ? 18 : 24 }}>
                <h3 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', marginBottom: 8 }}>Jamoaga qo'shiling</h3>
                <p style={{ color: '#64748b', fontSize: isMobile ? 12.5 : 14, lineHeight: 1.6, maxWidth: 460, margin: '0 auto' }}>
                  Yuristim o'smoqda. Missiyaga ishonadigan va birgalikda katta ish qilishni istagan hamkorlarni izlayapmiz.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 10 : 14 }}>
                {openRoles.map(r => (
                  <div key={r.title} style={{ border: '1.5px dashed #cbd5e1', borderRadius: 18, padding: isMobile ? 18 : 22, background: '#fafafa', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 46, height: 46, background: '#f1f5f9', color: '#94a3b8', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                        {r.ini}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14.5 }}>{r.title}</p>
                          <span style={{ fontSize: 8.5, fontWeight: 800, background: '#fff7ed', color: '#c2410c', padding: '2px 7px', borderRadius: 4, border: '0.5px solid #fed7aa', letterSpacing: '0.5px' }}>OCHIQ</span>
                        </div>
                        <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{r.role}</p>
                      </div>
                    </div>
                    <p style={{ fontSize: isMobile ? 12 : 13, color: '#64748b', lineHeight: 1.65, marginBottom: 14, flex: 1 }}>{r.desc}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                      {r.tags.map(tag => (
                        <span key={tag} style={{ fontSize: 10, fontWeight: 600, background: '#fff', color: '#475569', padding: '3px 9px', borderRadius: 5, border: '0.5px solid #e2e8f0' }}>{tag}</span>
                      ))}
                    </div>
                    <a href={founder.telegram} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: 13, padding: '11px', borderRadius: 11, textDecoration: 'none', marginTop: 'auto' }}>
                      <Send size={14} /> Telegram orqali bog'lanish
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Fade>
        </div>
      </section>
      <section style={{ padding: sp2, background: '#fafafa', borderTop: '0.5px solid #f1f5f9' }} id="aloqa">
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <Fade>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8 }}>Aloqa</p>
            <h2 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 10 }}>Bog'laning</h2>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: isMobile ? 13 : 15 }}>Savol, taklif yoki hamkorlik uchun</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://t.me/yuristim_online" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: isMobile ? 13.5 : 14, padding: isMobile ? '12px 20px' : '13px 24px', borderRadius: 12, textDecoration: 'none' }}>
                <Send size={15} /> Telegram
              </a>
              <a href="https://www.instagram.com/yuristim.online?igsh=MWh6d2hueTVpcXUxdg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#fff', color: '#0f172a', fontWeight: 600, fontSize: isMobile ? 13.5 : 14, padding: isMobile ? '12px 20px' : '13px 24px', borderRadius: 12, textDecoration: 'none', border: '1px solid #e2e8f0' }}>
                <Instagram size={15} /> Instagram
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
            <h2 style={{ fontSize: isMobile ? 30 : 38, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.5px' }}>Huquqiy yordamга bugun ega bo'ling</h2>
            <p style={{ color: '#94a3b8', marginBottom: 6, fontSize: isMobile ? 14 : 16 }}>Minglab fuqarolar va yuristlar uchun ochiq platforma</p>
            <p style={{ color: '#475569', marginBottom: 28, fontSize: isMobile ? 12 : 13.5 }}>Ro'yxatdan o'tish 1 daqiqa · Kredit karta talab etilmaydi</p>
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
            <a href="https://t.me/yuristim_online" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12.5, textDecoration: 'none' }}>
              <Send size={12} /> Telegram
            </a>
            <a href="https://www.instagram.com/yuristim.online?igsh=MWh6d2hueTVpcXUxdg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#64748b', fontSize: 12.5, textDecoration: 'none' }}>
              <Instagram size={12} /> Instagram
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
