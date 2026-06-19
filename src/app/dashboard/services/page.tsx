'use client'

import Link from 'next/link'
import { Map, FileText, Video, MessageCircle, HelpCircle, GraduationCap, BookOpen, Scale, Newspaper, FileSearch, ArrowRight, Send, Instagram } from 'lucide-react'

// ════════════════════════════════════════════════
// XIZMATLAR — yangi mantiqqa asoslangan
// 1-faza: hozir ishlaydigan xizmatlar
// 2-faza / 3-faza: kelajakda
// ════════════════════════════════════════════════

type Service = {
  icon: React.ReactNode
  title: string
  desc: string
  color: string
  icolor: string
  href?: string
  external?: boolean
  phase?: string   // bo'lsa — hali tayyor emas
}

// ── 1-FAZA: mavjud xizmatlar (yorliqsiz — shunchaki ishlaydi) ──
const liveServices: Service[] = [
  { icon: <Map size={24} />, title: 'Yuridik xizmatlar xaritasi', desc: "Yaqin atrofdagi yuristlarni xaritada toping", color: '#eff6ff', icolor: '#1d4ed8', href: '/dashboard/lawyers/map' },
  { icon: <MessageCircle size={24} />, title: 'Yordam', desc: "Savol va takliflar uchun biz bilan bog'laning", color: '#fff7ed', icolor: '#c2410c', href: 'https://t.me/yuristim_online', external: true },
  { icon: <HelpCircle size={24} />, title: 'Savollar', desc: "Ko'p so'raladigan savollarga javoblar", color: '#f0fdfa', icolor: '#134e4a', href: '/dashboard/faq' },
  { icon: <BookOpen size={24} />, title: 'Yuridik adabiyotlar', desc: "Elektron kutubxona — darslik va qo'llanmalar", color: '#faf5ff', icolor: '#7e22ce', href: 'https://elib.tsul.uz/', external: true },
  { icon: <FileSearch size={24} />, title: 'Yuridik maqolalar', desc: "Huquqshunoslar uchun tahliliy maqolalar", color: '#fef2f2', icolor: '#b91c1c', href: 'https://civil.uz/', external: true },
  { icon: <Scale size={24} />, title: 'Qonunchilik bazasi', desc: "Amaldagi qonun va normativ hujjatlar", color: '#f0fdf4', icolor: '#166534', href: 'https://lex.uz/', external: true },
  { icon: <Newspaper size={24} />, title: 'Yangiliklar', desc: "Platforma va huquq sohasidagi yangiliklar", color: '#eef2ff', icolor: '#4338ca', href: '/news' },
]

// ── 2 & 3-FAZA: kelajakda ──
const upcomingServices: Service[] = [
  { icon: <FileText size={24} />, title: 'Hujjat yaratish', desc: "Sun'iy intellekt bilan shartnoma va ariza tuzing", color: '#faf5ff', icolor: '#7e22ce', phase: '2-faza' },
  { icon: <GraduationCap size={24} />, title: 'Tariflar', desc: "Yuristlar uchun kengaytirilgan imkoniyatlar", color: '#fefce8', icolor: '#a16207', phase: '2-faza' },
  { icon: <Video size={24} />, title: 'Online video konsultatsiya', desc: "Yurist bilan to'g'ridan-to'g'ri video aloqa", color: '#f0fdf4', icolor: '#166534', phase: '3-faza' },
  { icon: <GraduationCap size={24} />, title: "Yuristlarni o'qitish tizimi", desc: "Malaka oshirish kurslari va sertifikatlar", color: '#eff6ff', icolor: '#1d4ed8', phase: '3-faza' },
]

export default function ServicesPage() {
  // Xizmat kartochkasi
  const renderCard = (s: Service) => {
    const isLive = !s.phase
    const inner = (
      <div style={{
        background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: '18px 14px',
        textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
        cursor: isLive ? 'pointer' : 'default', transition: 'all 200ms',
        opacity: isLive ? 1 : 0.7,
      }}
        onMouseEnter={e => isLive && ((e.currentTarget as HTMLElement).style.borderColor = '#0f172a')}
        onMouseLeave={e => isLive && ((e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0')}>
        <div style={{ width: 52, height: 52, background: s.color, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: s.icolor, flexShrink: 0 }}>
          {s.icon}
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4, lineHeight: 1.3 }}>{s.title}</p>
        <p style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.4, marginBottom: s.phase ? 8 : 0, flex: 1 }}>{s.desc}</p>
        {s.phase && (
          <span style={{ fontSize: 9.5, fontWeight: 700, background: '#f1f5f9', color: '#94a3b8', padding: '2px 8px', borderRadius: 5 }}>{s.phase}</span>
        )}
      </div>
    )
    if (!isLive) return <div key={s.title}>{inner}</div>
    if (s.external) return <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{inner}</a>
    return <Link key={s.title} href={s.href!} style={{ textDecoration: 'none' }}>{inner}</Link>
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', marginBottom: 6 }}>Xizmatlar</h1>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Barcha huquqiy imkoniyatlar bir joyda</p>

      {/* 1-FAZA: mavjud xizmatlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
        {liveServices.map(renderCard)}
      </div>

      {/* Ijtimoiy tarmoqlar banner */}
      <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e1b4b)', borderRadius: 18, padding: '22px 24px', marginBottom: 32 }}>
        <p style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 6 }}>Bizni kuzatib boring</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: 16 }}>
          Yangi imkoniyatlar va so'nggi yangiliklardan birinchilardan bo'lib xabardor bo'lish uchun bizning ijtimoiy tarmoqlarimizga obuna bo'ling.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="https://t.me/yuristim_online" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 16px', borderRadius: 11, textDecoration: 'none', transition: 'background 150ms' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}>
            <Send size={15} /> Telegram
          </a>
          <a href="https://www.instagram.com/yuristim.online?igsh=MWh6d2hueTVpcXUxdg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 16px', borderRadius: 11, textDecoration: 'none', transition: 'background 150ms' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}>
            <Instagram size={15} /> Instagram
          </a>
        </div>
      </div>

      {/* Kelajakdagi xizmatlar (2 & 3-faza) */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Tez orada</h2>
          <span style={{ fontSize: 10.5, fontWeight: 600, color: '#94a3b8', background: '#f1f5f9', padding: '3px 10px', borderRadius: 6 }}>ishlab chiqilmoqda</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {upcomingServices.map(renderCard)}
        </div>
      </div>

      {/* Savollar havolasi */}
      <Link href="/dashboard/faq" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px',
        textDecoration: 'none', marginBottom: 20, transition: 'border-color 150ms',
      }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#0f172a'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, background: '#f0fdfa', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#134e4a', flexShrink: 0 }}>
            <HelpCircle size={20} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Savollaringiz bormi?</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>Ko'p so'raladigan savollarga javoblarni o'qing</p>
          </div>
        </div>
        <ArrowRight size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
      </Link>
    </div>
  )
}
