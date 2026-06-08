import Link from 'next/link'
import { Scale, ArrowLeft, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Ommaviy offerta — Yuristim',
}

export default function OffertaPage() {
  const sections = [
    {
      num: '1',
      title: 'Umumiy qoidalar',
      content: [
        'Ushbu Ommaviy offerta (bundan buyon — Shartnoma) Yuristim platformasi (yuristimuz-sayt.vercel.app) va uning foydalanuvchilari o\'rtasidagi munosabatlarni tartibga soladi.',
        'Ro\'yxatdan o\'tish tugmasini bosish orqali siz ushbu shartlarni to\'liq o\'qib chiqqaningizni va ularga rozilik bildirishingizni tasdiqlaysiz.',
        'Platforma hozirda sinov (beta) rejimida ishlaydi. Xizmatlar va qoidalar takomillashtirilib borilishi mumkin.',
      ]
    },
    {
      num: '2',
      title: 'Sinov rejimi va cheklovlar',
      content: [
        'Platforma hozirda beta (sinov) bosqichida bo\'lib, barcha xizmatlar bepul taqdim etiladi.',
        'Sinov davri mobaynida texnik nosozliklar, ma\'lumot yo\'qolishi yoki xizmat to\'xtatilishi mumkin.',
        'Platforma ma\'muriyati foydalanuvchilarga oldindan xabar bermagan holda xizmatlarni o\'zgartirish, to\'xtatish yoki yangilash huquqini saqlab qoladi.',
        'Foydalanuvchilar platformada saqlangan ma\'lumotlarning zaxira nusxasini o\'zlari saqlashlari tavsiya etiladi.',
      ]
    },
    {
      num: '3',
      title: 'Foydalanuvchi majburiyatlari',
      content: [
        'Ro\'yxatdan o\'tayotganda haqiqiy va to\'g\'ri ma\'lumotlar kiritish majburiy.',
        'Boshqa foydalanuvchilar nomidan ro\'yxatdan o\'tish, aldamchi ma\'lumot berish taqiqlanadi.',
        'Platformada noqonuniy, haqoratli yoki zararli kontent joylashtirish taqiqlanadi.',
        'Foydalanuvchi login va parolining maxfiyligini ta\'minlash uchun o\'zi javobgar.',
      ]
    },
    {
      num: '4',
      title: 'Yuristlar uchun maxsus shartlar',
      content: [
        'Platformada yurist sifatida ro\'yxatdan o\'tgan shaxslar o\'zlarining malakasi va ma\'lumotlari to\'g\'riligini kafolatlaydi.',
        'Platforma ma\'muriyati yuristlarning kasbiy faoliyati uchun javobgar emas.',
        'Berilgan huquqiy maslahatlar uchun to\'liq javobgarlik maslahat beruvchi yurist zimmасида.',
        'Platforma faqat aloqa vositasi bo\'lib, yurist-mijoz munosabatlariga tomon bo\'lmaydi.',
      ]
    },
    {
      num: '5',
      title: "Ma'lumotlar va maxfiylik",
      content: [
        'Foydalanuvchi ma\'lumotlari faqat platforma xizmatlari doirasida ishlatiladi.',
        'Uchinchi shaxslarga ma\'lumot foydalanuvchi rozilisisiz berilmaydi.',
        'Platforma ma\'lumotlarni texnik maqsadlarda qayta ishlash huquqini saqlab qoladi.',
        'Akkountni o\'chirish so\'rovi bo\'lsa, ma\'lumotlar 30 kun ichida o\'chiriladi.',
      ]
    },
    {
      num: '6',
      title: 'Risklar haqida ogohlantirish',
      content: [
        'Platforma sinov rejimida ishlayapti — to\'liq ishonchlilik kafolatlanmaydi.',
        'Yuristim platformasi orqali olingan maslahatlar rasmiy yuridik yordam o\'rnini bosa olmaydi.',
        'Muhim huquqiy masalalarda litsenziyalangan advokat bilan shaxsan uchrashish tavsiya etiladi.',
        'Platforma foydalanuvchilarga yetkazilgan bilvosita zararlar uchun javobgar emas.',
      ]
    },
    {
      num: '7',
      title: 'Aloqa va murojaatlar',
      content: [
        'Shikoyat va takliflar uchun: @lawyer_nematov (Telegram)',
        'Elektron pochta: diyorbeknematov07@gmail.com',
        'Murojaatlarga 3 ish kuni ichida javob beriladi.',
      ]
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px', height: 60, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/auth/signup" style={{ width: 34, height: 34, background: '#f1f5f9', border: '0.5px solid #e2e8f0', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            <ArrowLeft size={15} color="#475569" />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#0f172a', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>Yuristim</span>
          </div>
          <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Ommaviy offerta</span>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '32px 16px 60px' }}>
        {/* Hero */}
        <div style={{ background: '#0f172a', borderRadius: 18, padding: '28px 28px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, background: 'rgba(99,102,241,0.15)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(255,255,255,0.1)', color: '#94a3b8', padding: '3px 10px', borderRadius: 5, letterSpacing: '0.5px' }}>RASMIY HUJJAT</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: 8 }}>Ommaviy offerta</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            Yuristim platformasidan foydalanish shartlari. Ro'yxatdan o'tishdan oldin diqqat bilan o'qing.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, background: '#fff7ed', color: '#c2410c', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>⚠️ Sinov (beta) rejimi</span>
            <span style={{ fontSize: 11, background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>✓ Bepul xizmat</span>
            <span style={{ fontSize: 11, background: '#eef2ff', color: '#4338ca', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>Yangilangan: 2026</span>
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sections.map(s => (
            <div key={s.num} style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '0.5px solid #f8fafc' }}>
                <div style={{ width: 28, height: 28, background: '#f1f5f9', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#0f172a', flexShrink: 0 }}>
                  {s.num}
                </div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{s.title}</h2>
              </div>
              <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {s.content.map((line, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, color: '#475569', lineHeight: 1.65 }}>
                    <CheckCircle2 size={14} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: 24, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: '20px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#166534', marginBottom: 12 }}>Shartlarni qabul qilib ro'yxatdan o'ting</p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 11, textDecoration: 'none' }}>
            Ro'yxatdan o'tish →
          </Link>
        </div>
      </main>
    </div>
  )
}
