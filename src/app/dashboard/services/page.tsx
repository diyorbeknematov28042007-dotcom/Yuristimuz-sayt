'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MapPin, FileText, Video, MessageCircle, HelpCircle, Crown, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

const services = [
  { icon: <MapPin size={24}/>, emoji:'🗺️', title:'Xarita', desc:"Yaqin advokatni toping", color:'#eff6ff', icolor:'#1d4ed8', phase:'Faza 2', available:false },
  { icon: <FileText size={24}/>, emoji:'📄', title:'Hujjat', desc:"AI bilan shartnoma tuzing", color:'#faf5ff', icolor:'#7e22ce', phase:'Faza 2', available:false },
  { icon: <Video size={24}/>, emoji:'🎥', title:'Zoom', desc:"Video konsultatsiya", color:'#f0fdf4', icolor:'#166534', phase:'Faza 3', available:false },
  { icon: <MessageCircle size={24}/>, emoji:'✈️', title:'Yordam', desc:"Telegram orqali", color:'#fff7ed', icolor:'#c2410c', href:'https://t.me/lawyer_nematov', available:true, external:true },
  { icon: <HelpCircle size={24}/>, emoji:'❓', title:'FAQ', desc:"Tez-tez savolar", color:'#f0fdfa', icolor:'#134e4a', href:'/dashboard/faq', available:true },
  { icon: <Crown size={24}/>, emoji:'💎', title:'Pro tarif', desc:"Kengaytirilgan imkoniyatlar", color:'#fafafa', icolor:'#475569', phase:'Faza 2', available:false },
]

const faqs = [
  { q:"Platforma to'lovlimi?", a:"Beta versiyada hammasi bepul. Faza 2 dan boshlab yuristlar uchun ixtiyoriy Pro tarif joriy etiladi." },
  { q:"Email majburiyimi?", a:"Yo'q. Faqat login va parol bilan ro'yxatdan o'tasiz. Email ixtiyoriy — faqat parolni tiklash uchun." },
  { q:"Yurist verifikatsiyasi nima?", a:"Admin tomonidan tasdiqlanmish yuristlar blue badge oladi." },
  { q:"Parolni unutsam nima qilaman?", a:"Login sahifasida 'Parolni unutdingizmi?' tugmasini bosing." },
]

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number|null>(null)

  return (
    <div style={{ maxWidth:760, margin:'0 auto' }}>
      <h1 style={{ fontSize:22, fontWeight:800, color:'#0f172a', letterSpacing:'-0.4px', marginBottom:6 }}>Xizmatlar</h1>
      <p style={{ fontSize:13, color:'#64748b', marginBottom:24 }}>Barcha huquqiy xizmatlar bir joyda</p>

      {/* Services grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:32 }}>
        {services.map(s => {
          const inner = (
            <div style={{
              background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:16, padding:'18px 14px',
              textAlign:'center', height:'100%', display:'flex', flexDirection:'column', alignItems:'center',
              cursor: s.available?'pointer':'default', transition:'all 200ms',
              opacity: s.available ? 1 : 0.75,
            }}
              onMouseEnter={e => s.available && ((e.currentTarget as HTMLElement).style.borderColor = '#0f172a')}
              onMouseLeave={e => s.available && ((e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0')}>
              <div style={{ width:52, height:52, background:s.color, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, color:s.icolor }}>
                {s.icon}
              </div>
              <p style={{ fontSize:13.5, fontWeight:700, color:'#0f172a', marginBottom:4 }}>{s.title}</p>
              <p style={{ fontSize:11.5, color:'#94a3b8', lineHeight:1.4, marginBottom:s.phase||s.available?8:0 }}>{s.desc}</p>
              {s.phase && (
                <span style={{ fontSize:9.5, fontWeight:700, background:'#f1f5f9', color:'#94a3b8', padding:'2px 8px', borderRadius:5 }}>{s.phase}</span>
              )}
              {s.available && !s.phase && (
                <span style={{ fontSize:9.5, fontWeight:700, background:'#f0fdf4', color:'#166534', padding:'2px 8px', borderRadius:5 }}>Mavjud ✓</span>
              )}
            </div>
          )
          if (!s.available) return <div key={s.title}>{inner}</div>
          if (s.external) return <a key={s.title} href={s.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration:'none' }}>{inner}</a>
          return <Link key={s.title} href={s.href!} style={{ textDecoration:'none' }}>{inner}</Link>
        })}
      </div>

      {/* Roadmap banner */}
      <div style={{ background:'linear-gradient(135deg,#0f172a,#1e1b4b)', borderRadius:18, padding:'20px 24px', marginBottom:32, display:'flex', alignItems:'flex-start', gap:16 }}>
        <div style={{ width:44, height:44, background:'rgba(255,255,255,0.08)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:22 }}>🚀</div>
        <div>
          <p style={{ fontWeight:700, color:'#fff', fontSize:15, marginBottom:4 }}>Faza 2 tayyor bo'lyapti</p>
          <p style={{ fontSize:12.5, color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>Yandex Maps, hujjat generatsiyasi va to'lov tizimlari 2026 Q3 da ishga tushadi. Bildirishnoma olish uchun ro'yxatdan o'ting.</p>
          <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:12, background:'rgba(255,255,255,0.1)', color:'#fff', fontSize:12, fontWeight:600, padding:'7px 14px', borderRadius:9, textDecoration:'none' }}>
            ✈️ Telegram kanalga obuna <ArrowRight size={12}/>
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 style={{ fontSize:16, fontWeight:700, color:'#0f172a', marginBottom:14 }}>Ko'p beriladigan savollar</h2>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background:'#fff', border:`0.5px solid ${openFaq===i?'#c7d2fe':'#e2e8f0'}`, borderRadius:13, overflow:'hidden', transition:'border-color 150ms' }}>
              <button onClick={() => setOpenFaq(openFaq===i?null:i)}
                style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'none', border:'none', cursor:'pointer', gap:12, textAlign:'left' }}>
                <span style={{ fontSize:13.5, fontWeight:600, color:'#0f172a', lineHeight:1.4 }}>{f.q}</span>
                {openFaq===i ? <ChevronUp size={14} color="#94a3b8" style={{ flexShrink:0 }}/> : <ChevronDown size={14} color="#94a3b8" style={{ flexShrink:0 }}/>}
              </button>
              {openFaq===i && (
                <div style={{ padding:'0 16px 14px', fontSize:13, color:'#475569', lineHeight:1.7, borderTop:'0.5px solid #f1f5f9', paddingTop:12 }}>
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <Link href="/dashboard/faq" style={{ display:'inline-flex', alignItems:'center', gap:5, marginTop:12, fontSize:13, color:'#4338ca', fontWeight:600, textDecoration:'none' }}>
          Barcha savollar <ArrowRight size={13}/>
        </Link>
      </div>
    </div>
  )
}
