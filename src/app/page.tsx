'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Scale, Search, MessageCircle, FileText, MapPin, Bot,
  CheckCircle, ArrowRight, Star, Shield, Zap, Users,
  ChevronRight, Mail, Send, Crown, Sparkles, Building2,
  Clock, TrendingUp, Award, Lock, Globe, Phone,
  UserCheck, Briefcase, Heart, BadgeCheck, X, Menu
} from 'lucide-react'

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

function Fade({ children, delay = 0, className = '', y = 20 }: {
  children: React.ReactNode; delay?: number; className?: string; y?: number
}) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity 0.7s ${delay}ms cubic-bezier(.4,0,.2,1), transform 0.7s ${delay}ms cubic-bezier(.4,0,.2,1)`,
    }}>
      {children}
    </div>
  )
}

const specializations = [
  { icon: <Users size={22} />, label: 'Oilaviy huquq', color: 'bg-pink-50 text-pink-600' },
  { icon: <Building2 size={22} />, label: 'Biznes huquqi', color: 'bg-blue-50 text-blue-600' },
  { icon: <MapPin size={22} />, label: 'Mulk huquqi', color: 'bg-green-50 text-green-600' },
  { icon: <Briefcase size={22} />, label: 'Mehnat huquqi', color: 'bg-orange-50 text-orange-600' },
  { icon: <TrendingUp size={22} />, label: 'Soliq huquqi', color: 'bg-yellow-50 text-yellow-600' },
  { icon: <Lock size={22} />, label: 'Jinoyat huquqi', color: 'bg-red-50 text-red-600' },
  { icon: <FileText size={22} />, label: 'Shartnomalar', color: 'bg-purple-50 text-purple-600' },
  { icon: <Globe size={22} />, label: 'Migratsiya', color: 'bg-teal-50 text-teal-600' },
]

const steps = [
  { num: '01', icon: <FileText size={24} />, title: "Elon qo'ying", desc: "Huquqiy muammongizni batafsil yozing. Bepul va bir daqiqada tayyor.", color: 'bg-blue-50 text-blue-600' },
  { num: '02', icon: <Search size={24} />, title: 'Yurist toping', desc: "Soha, reyting va joylashuv bo'yicha filtrlang. Yuzlab mutaxassis.", color: 'bg-green-50 text-green-600' },
  { num: '03', icon: <MessageCircle size={24} />, title: 'Bog\'laning', desc: "Real-time chat orqali yurist bilan darhol bog'laning.", color: 'bg-purple-50 text-purple-600' },
  { num: '04', icon: <CheckCircle size={24} />, title: 'Natija oling', desc: "Professional yurist yordamida huquqiy muammongizni yechin.", color: 'bg-orange-50 text-orange-600' },
]

const features = [
  { icon: <Search size={20} />, title: 'Aqlli qidiruv', desc: "Soha, tajriba, joylashuv va narx bo'yicha filtrlang. Kerakli yuristni bir daqiqada toping.", color: 'bg-blue-50 text-blue-600' },
  { icon: <MessageCircle size={20} />, title: 'Real-time chat', desc: "Yurist bilan to'g'ridan-to'g'ri platformada gaplashing. Barcha suhbatlar saqlanadi.", color: 'bg-green-50 text-green-600' },
  { icon: <Bot size={20} />, title: 'AI huquqiy maslahat', desc: "Sun'iy intellekt yordamida oddiy savollarga darhol javob oling, so'ng yuristga yo'lantirilasiz.", color: 'bg-purple-50 text-purple-600' },
  { icon: <FileText size={20} />, title: 'Hujjat generatsiya', desc: "AI yordamida shartnoma, ariza va boshqa yuridik hujjatlarni tez tuzing.", color: 'bg-orange-50 text-orange-600' },
  { icon: <MapPin size={20} />, title: 'Advokatura xaritasi', desc: "Yandex Maps orqali yaqin atrofdagi advokatlarni toping va yo'nalma oling.", color: 'bg-teal-50 text-teal-600' },
  { icon: <Shield size={20} />, title: 'Xavfsiz to\'lov', desc: "Payme va Click orqali xavfsiz to'lov. Natijadan mamnun bo'lmasangiz — qaytariladi.", color: 'bg-red-50 text-red-600' },
]

const phases = [
  {
    phase: 'Faza 1',
    title: 'Beta — Hozir',
    badge: 'Bepul',
    badgeColor: 'bg-green-100 text-green-700 border border-green-200',
    color: 'border-blue-500 bg-blue-50',
    headerColor: 'bg-blue-600',
    items: [
      'Platforma bepul foydalanish',
      'Yuristlar bilan chat',
      'Elon joylash va ko\'rish',
      'Yurist profillari',
      'Asosiy qidiruv va filtr',
      'Beta versiya — barcha feedback qabul qilinadi',
    ],
    note: 'Beta davri — barcha xizmatlar bepul',
    icon: <Sparkles size={18} />,
  },
  {
    phase: 'Faza 2',
    title: 'Pro — 2026 Q3',
    badge: 'Brenda kelayotgan',
    badgeColor: 'bg-blue-100 text-blue-700 border border-blue-200',
    color: 'border-gray-200',
    headerColor: 'bg-gray-700',
    items: [
      'Yuristlar uchun Pro tarif',
      'Payme va Click to\'lov',
      'Kredit tizimi',
      'Advokatura xaritasi (Yandex)',
      'Profil statistikasi',
      'Ko\'proq ko\'rinish uchun boost',
    ],
    note: 'Mijozlar uchun asosiy xizmatlar bepul qoladi',
    icon: <Zap size={18} />,
  },
  {
    phase: 'Faza 3',
    title: 'Full Platform — 2027',
    badge: 'Kelajak',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-200',
    color: 'border-gray-200',
    headerColor: 'bg-purple-600',
    items: [
      'AI huquqiy chatbot',
      'Hujjat generatsiyasi (PDF)',
      'Zoom konsultatsiya',
      'Yurist workspace',
      'Mobil ilova (iOS/Android)',
      'Enterprise (yirik advokaturalar)',
    ],
    note: 'To\'liq legal-tech ekotizimi',
    icon: <Crown size={18} />,
  },
]

const founders = [
  {
    initials: 'DN',
    name: 'Diyorbek Nematov',
    role: 'Founder & CEO',
    desc: "Huquq talabasi va legal-tech tadbirkor. O'zbekistonda huquqiy xizmatlarni raqamlashtirish missiyasi.",
    color: 'bg-blue-100 text-blue-700',
    telegram: 'https://t.me/lawyer_nematov',
    email: 'diyorbeknematov07@gmail.com',
    isFounder: true,
  },
  {
    initials: '?',
    name: 'Texnik Co-founder',
    role: 'CTO — Vakansiya',
    desc: "Full-stack developer izlanmoqda. React, Node.js, Supabase tajribasi. Equity + maosh.",
    color: 'bg-gray-100 text-gray-500',
    isVacancy: true,
  },
  {
    initials: '?',
    name: 'Marketing Co-founder',
    role: 'CMO — Vakansiya',
    desc: "Digital marketing va SMM mutaxassisi izlanmoqda. O'zbekiston bozorini biluvchi.",
    color: 'bg-gray-100 text-gray-500',
    isVacancy: true,
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
    <div className="min-h-screen bg-white" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <header style={{
        opacity: started ? 1 : 0,
        transform: started ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }} className="bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Scale size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">LegalUZ</span>
            <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium ml-1">Beta</span>
          </div>
          <nav className="hidden md:flex items-center gap-7">
            {[
              { label: 'Xizmatlar', href: '#xizmatlar' },
              { label: 'Fazalar', href: '#fazalar' },
              { label: 'Jamoa', href: '#jamoa' },
              { label: 'Aloqa', href: '#aloqa' },
            ].map(item => (
              <a key={item.label} href={item.href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login"
              className="hidden md:flex text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-1.5">
              Kirish
            </Link>
            <Link href="/auth/signup"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
              Bepul boshlash <ArrowRight size={14} />
            </Link>
            <button className="md:hidden p-1.5" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 flex flex-col gap-3">
            {['Xizmatlar', 'Fazalar', 'Jamoa', 'Aloqa'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenu(false)}
                className="text-sm text-gray-700 font-medium py-1">{item}</a>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="pt-20 pb-20 px-5" style={{ background: 'linear-gradient(165deg, #eff6ff 0%, #f8faff 50%, #ffffff 100%)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <div style={{ opacity: started ? 1 : 0, transform: started ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.6s 0.1s ease' }}>
            <div className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-7 shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Beta versiyada — barcha xizmatlar bepul
              <ChevronRight size={12} />
            </div>
          </div>

          <h1 style={{ opacity: started ? 1 : 0, transform: started ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.65s 0.2s ease' }}
            className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.12] mb-5 tracking-tight">
            Kerakli yuristni<br />
            <span style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              tez toping
            </span>
          </h1>

          <p style={{ opacity: started ? 1 : 0, transform: started ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.65s 0.3s ease' }}
            className="text-gray-500 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            O'zbekistondagi birinchi huquqiy xizmatlar platformasi. Bepul elon qo'ying, tajribali yuristlarni toping va muammolaringizni yechin.
          </p>

          <div style={{ opacity: started ? 1 : 0, transform: started ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.65s 0.4s ease' }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link href="/auth/signup?role=client"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-base">
              <Scale size={18} /> Yurist topish
            </Link>
            <Link href="/auth/signup?role=lawyer"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-7 py-3.5 rounded-xl transition-all border border-gray-200 shadow-sm text-base">
              <Briefcase size={18} /> Yurist sifatida kirish
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} style={{ opacity: started ? 1 : 0, transition: 'opacity 0.7s 0.55s ease' }}
            className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
            {[
              { value: lawyers, suffix: '+', label: 'Yuristlar' },
              { value: ads, suffix: '+', label: 'Elonlar' },
              { value: regions, suffix: '', label: 'Viloyat' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold text-gray-900 tabular-nums">{s.value}{s.suffix}</div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALIZATIONS ── */}
      <section className="py-16 px-5 bg-white" id="xizmatlar">
        <div className="max-w-6xl mx-auto">
          <Fade className="text-center mb-10">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Sohalar</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Barcha sohalarda yordam</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Qaysi huquqiy masala bo'lmasin — platformamizda mutaxassis bor</p>
          </Fade>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specializations.map((s, i) => (
              <Fade key={s.label} delay={i * 50}>
                <div className="group cursor-pointer border border-gray-100 rounded-2xl p-5 text-center hover:border-blue-200 hover:shadow-md transition-all duration-200 bg-white">
                  <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    {s.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{s.label}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-5" style={{ background: '#f8faff' }}>
        <div className="max-w-6xl mx-auto">
          <Fade className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Jarayon</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Qanday ishlaydi?</h2>
            <p className="text-gray-500">4 oddiy qadamda huquqiy muammoni yechin</p>
          </Fade>
          <div className="grid md:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <Fade key={step.num} delay={i * 100}>
                <div className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all h-full">
                  <div className="text-xs font-bold text-gray-300 mb-4 font-mono">{step.num}</div>
                  <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center mb-4`}>
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-base">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight size={18} className="text-gray-300" />
                    </div>
                  )}
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-16 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <Fade className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Imkoniyatlar</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Nima uchun LegalUZ?</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Bir platformada barcha huquqiy xizmatlar — tez, ishonchli va qulay</p>
          </Fade>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Fade key={f.title} delay={i * 70}>
                <div className="group border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all bg-white h-full">
                  <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHASES ── */}
      <section className="py-16 px-5" style={{ background: '#f8faff' }} id="fazalar">
        <div className="max-w-6xl mx-auto">
          <Fade className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Rivojlanish</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Platforma fazalari</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Hozir beta versiyamiz to'liq bepul. Kelajakda qo'shiladigan xizmatlar haqida batafsil:
            </p>
          </Fade>

          {/* Beta banner */}
          <Fade>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-green-800 mb-0.5">Hozir Beta versiyada — hammasi bepul!</p>
                <p className="text-sm text-green-700">Platform rivojlanish bosqichida. Barcha xizmatlar bepul taqdim etiladi. Sizning fikr va takliflaringiz bizga juda muhim.</p>
              </div>
              <Link href="/auth/signup"
                className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
                Bepul kirish →
              </Link>
            </div>
          </Fade>

          <div className="grid md:grid-cols-3 gap-6">
            {phases.map((phase, i) => (
              <Fade key={phase.phase} delay={i * 100}>
                <div className={`border-2 ${phase.color} rounded-2xl overflow-hidden h-full flex flex-col`}>
                  <div className={`${phase.headerColor} px-5 py-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-2 text-white">
                      {phase.icon}
                      <span className="font-bold text-sm">{phase.phase}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${phase.badgeColor} bg-white/90`}>
                      {phase.badge}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col bg-white">
                    <h3 className="font-bold text-gray-900 mb-4 text-base">{phase.title}</h3>
                    <ul className="space-y-2.5 flex-1">
                      {phase.items.map(item => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-400 italic">{phase.note}</p>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR LAWYERS ── */}
      <section className="py-16 px-5 bg-blue-600">
        <div className="max-w-4xl mx-auto">
          <Fade className="text-center">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Scale size={28} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Yuristmisiz?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              14 kun bepul sinab ko'ring. Yangi mijozlar toping, elon joylang va biznesingizni rivojlantiring
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-8">
              {[
                { icon: <UserCheck size={20} />, text: 'Maqsadli mijozlar' },
                { icon: <TrendingUp size={20} />, text: 'Profil statistikasi' },
                { icon: <Briefcase size={20} />, text: 'Yurist workspace' },
              ].map(item => (
                <div key={item.text} className="bg-blue-500/60 backdrop-blur rounded-xl p-4 text-center border border-blue-400/50">
                  <div className="flex justify-center mb-2 text-blue-100">{item.icon}</div>
                  <p className="text-sm text-blue-100 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
            <Link href="/auth/signup?role=lawyer"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl transition-colors shadow-lg text-base">
              Bepul boshlash <ArrowRight size={16} />
            </Link>
          </Fade>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-16 px-5 bg-white" id="jamoa">
        <div className="max-w-5xl mx-auto">
          <Fade className="text-center mb-12">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Jamoa</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Founders</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              LegalUZ ni qurayotgan jamoa. Co-founder vakansiyalari ochiq — qiziqsangiz bog'laning!
            </p>
          </Fade>
          <div className="grid md:grid-cols-3 gap-6">
            {founders.map((f, i) => (
              <Fade key={f.name} delay={i * 100}>
                <div className={`border rounded-2xl p-6 h-full flex flex-col ${f.isVacancy ? 'border-dashed border-gray-300 bg-gray-50' : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'} transition-all`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                      {f.isVacancy ? <Users size={24} className="text-gray-400" /> : f.initials}
                    </div>
                    <div>
                      <h3 className={`font-bold text-base ${f.isVacancy ? 'text-gray-400' : 'text-gray-900'}`}>{f.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${f.isVacancy ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                          {f.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className={`text-sm leading-relaxed flex-1 ${f.isVacancy ? 'text-gray-400' : 'text-gray-500'}`}>{f.desc}</p>

                  {f.isFounder && (
                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2">
                      <a href={f.telegram} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Send size={13} className="text-blue-600" />
                        </div>
                        @lawyer_nematov
                      </a>
                      <a href={`mailto:${f.email}`}
                        className="flex items-center gap-2.5 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
                        <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail size={13} className="text-gray-500" />
                        </div>
                        {f.email}
                      </a>
                    </div>
                  )}

                  {f.isVacancy && (
                    <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors border border-orange-200">
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
      <section className="py-16 px-5" style={{ background: '#f8faff' }} id="aloqa">
        <div className="max-w-2xl mx-auto text-center">
          <Fade>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Aloqa</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Bog'laning</h2>
            <p className="text-gray-500 mb-8">Savol, taklif yoki hamkorlik uchun murojaat qiling</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md">
                <Send size={18} />
                Telegram orqali
              </a>
              <a href="mailto:diyorbeknematov07@gmail.com"
                className="flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3.5 rounded-xl transition-all border border-gray-200 shadow-sm">
                <Mail size={18} />
                Email orqali
              </a>
            </div>
          </Fade>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-5 bg-gray-900">
        <Fade className="text-center max-w-2xl mx-auto">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale size={22} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Bugunoq boshlang</h2>
          <p className="text-gray-400 mb-2 text-lg">Beta versiya — barcha xizmatlar bepul</p>
          <p className="text-gray-500 text-sm mb-8">Ro'yxatdan o'tish 1 daqiqa vaqt oladi. Hech qanday karta kerak emas.</p>
          <Link href="/auth/signup"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-xl text-base">
            Bepul ro'yxatdan o'tish <ArrowRight size={16} />
          </Link>
        </Fade>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-950 border-t border-gray-800 py-10 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale size={14} className="text-white" />
              </div>
              <span className="font-bold text-white">LegalUZ</span>
              <span className="text-xs bg-green-900 text-green-400 px-2 py-0.5 rounded-full">Beta</span>
            </div>
            <p className="text-gray-500 text-sm">© 2026 LegalUZ. Barcha huquqlar himoyalangan.</p>
            <div className="flex items-center gap-5">
              <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
                <Send size={14} /> Telegram
              </a>
              <a href="mailto:diyorbeknematov07@gmail.com"
                className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
                <Mail size={14} /> Email
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
