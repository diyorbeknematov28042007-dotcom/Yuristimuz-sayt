'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    category: 'Platforma haqida',
    items: [
      { q: "Platforma to'lovlimi?", a: "Beta versiyada hammasi bepul. Faza 2 dan (2026 Q3) boshlab yuristlar uchun ixtiyoriy Pro tarif joriy etiladi. Mijozlar uchun asosiy xizmatlar doimo bepul bo'lib qoladi." },
      { q: "Yuristim ishonchli platformami?", a: "Ha. Barcha yuristlar admin tomonidan tekshiriladi. Verifikatsiya badge olgan yuristlar haqiqiy huquqiy ma'lumotga ega ekanligi tasdiqlangan." },
      { q: "Mobil ilovasi bormi?", a: "Hozircha sayt mobile-optimallashtirilgan. Faza 3 da (2027) iOS va Android ilovalar chiqariladi." },
    ]
  },
  {
    category: 'Hisob va kirish',
    items: [
      { q: "Ro'yxatdan o'tish uchun email kerakmi?", a: "Yo'q. Faqat login va parol bilan ro'yxatdan o'tasiz. Email ixtiyoriy — faqat parolni tiklash kerak bo'lganda ishlatiladi." },
      { q: "Parolni unutsam nima qilaman?", a: "Kirishdagi 'Parolni unutdingizmi?' tugmasini bosing. Email manzilingizga 6 raqamli kod yuboriladi. Kod bilan yangi parol o'rnatasiz. Agar email qo'shilmagan bo'lsa, Telegram orqali admin bilan bog'laning." },
      { q: "Loginimni o'zgartirsa bo'ladimi?", a: "Hozircha login o'zgartirilmaydi. Faza 2 da bu imkoniyat qo'shiladi." },
    ]
  },
  {
    category: "E'lonlar",
    items: [
      { q: "E'lon joylash bepulmi?", a: "Ha, Beta davr mo'bbaynida barcha e'lonlar bepul joylashtiriladi." },
      { q: "E'lonni qanday o'chiraman?", a: "Hozircha e'lonni o'chirish uchun admin bilan bog'laning (Telegram: @lawyer_nematov). Faza 2 da shaxsiy boshqaruv paneli qo'shiladi." },
      { q: "Qanday kategoriyalar mavjud?", a: "Oilaviy, Biznes, Mulk, Mehnat, Soliq, Jinoyat, Shartnoma va Migratsiya huquqi. Kelajakda kategoriyalar kengaytiriladi." },
    ]
  },
  {
    category: 'Yuristlar uchun',
    items: [
      { q: "Yurist sifatida qanday ro'yxatdan o'taman?", a: "Ro'yxatdan o'tishda 'Yurist' rolini tanlang. So'ng profilingizni to'ldiring — tajriba, ixtisoslik, bio. Verifikatsiya uchun admin bilan bog'laning." },
      { q: "Verifikatsiya badge qanday olinadi?", a: "Admin tomonidan hujjatlarni tekshirgandan so'ng blue badge beriladi. Telegram: @lawyer_nematov orqali murojaat qiling." },
      { q: "Pro tarif nima narxda bo'ladi?", a: "Faza 2 da taxminan 149,000 so'm/oy. Beta davr uchun hamma narsa bepul." },
    ]
  },
  {
    category: 'Chat va AI',
    items: [
      { q: "AI konsultant naqadar ishonchli?", a: "AI O'zbekiston qonunchiligiga asoslanib javob beradi, lekin xato qilishi mumkin. Muhim huquqiy masalalar uchun haqiqiy yurist bilan maslahatlashing." },
      { q: "Chat tarixi saqlanadimi?", a: "Ha, suhbat tarixi saqlanaadi. Faqat siz va yurist ko'ra olasiz." },
      { q: "Xizmatni qanday yakunlayman?", a: "Chat ichida 'Xizmat yakunlandi' tugmasini bosing. So'ng yuristga baho va sharh qoldiring." },
    ]
  },
]

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggle = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link href="/dashboard/services" style={{ background: '#f1f5f9', border: 'none', borderRadius: 9, padding: 8, display: 'flex', cursor: 'pointer', textDecoration: 'none' }}>
          <ArrowLeft size={16} color="#475569" />
        </Link>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>Ko'p beriladigan savollar</h1>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Eng ko'p so'raladigan savollar va javoblar</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {faqs.map(section => (
          <div key={section.category}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10 }}>
              {section.category}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {section.items.map((item, i) => {
                const key = `${section.category}-${i}`
                const isOpen = openItems.has(key)
                return (
                  <div key={key} style={{ background: '#fff', border: isOpen ? '1px solid #c7d2fe' : '0.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', transition: 'border 150ms' }}>
                    <button onClick={() => toggle(key)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', gap: 12, textAlign: 'left' }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>{item.q}</span>
                      {isOpen ? <ChevronUp size={15} color="#94a3b8" style={{ flexShrink: 0 }} /> : <ChevronDown size={15} color="#94a3b8" style={{ flexShrink: 0 }} />}
                    </button>
                    {isOpen && (
                      <div style={{ padding: '0 16px 14px', fontSize: 13, color: '#475569', lineHeight: 1.7, borderTop: '0.5px solid #f1f5f9', paddingTop: 12 }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: '20px', background: '#f8fafc', borderRadius: 16, border: '0.5px solid #e2e8f0', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Savolingiz javobsiz qoldimi?</p>
        <a href="https://t.me/lawyer_nematov" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
          ✈️ Telegram orqali so'rang
        </a>
      </div>
    </div>
  )
}
