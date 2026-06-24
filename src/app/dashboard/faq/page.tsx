'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp, Send } from 'lucide-react'

// ════════════════════════════════════════════════
// KO'P SO'RALADIGAN SAVOLLAR — yangi mantiq
// Til: ravon o'zbekcha, professional, mijozga hurmat bilan
// ════════════════════════════════════════════════

const faqs = [
  {
    category: 'Platforma haqida',
    items: [
      {
        q: "Yuristim nima va u menga qanday yordam beradi?",
        a: "Yuristim — O'zbekistondagi yuristlar va fuqarolarni bir joyda bog'laydigan huquqiy platforma. Bu yerda siz ishonchli yuristni topishingiz, ular bilan to'g'ridan-to'g'ri yozishishingiz, huquqiy e'lonlarni ko'rishingiz va sun'iy intellekt yordamida boshlang'ich maslahat olishingiz mumkin — barchasi bir ilovada."
      },
      {
        q: "Platformadan foydalanish pullikmi?",
        a: "Yo'q, hozircha platformaning barcha asosiy imkoniyatlari mutlaqo bepul. Yurist qidirish, yozishish va savol berish hech qanday to'lovsiz. Kelajakda yuristlar uchun qo'shimcha imkoniyatlar beruvchi ixtiyoriy tarif rejalari joriy etilishi mumkin, biroq fuqarolar uchun asosiy xizmatlar har doim bepul bo'lib qoladi."
      },
      {
        q: "Yuristim ishonchli platformami?",
        a: "Albatta. Platformadagi har bir yurist ma'muriyat tomonidan shaxsan tekshiriladi. Tasdiqdan o'tgan yuristlar maxsus belgi (tasdiqlangan nishon) bilan ajralib turadi — bu ularning malakasi va haqiqiyligi tasdiqlanganini bildiradi. Shu bois siz xotirjam bo'lib, ishonchli mutaxassisni tanlashingiz mumkin."
      },
      {
        q: "Mobil ilova bormi?",
        a: "Hozirda platforma telefon uchun to'liq moslashtirilgan — brauzer orqali qulay foydalanishingiz mumkin. Kelgusida iOS va Android uchun alohida ilovalar ishlab chiqilishi rejalashtirilgan. Yangiliklardan xabardor bo'lish uchun ijtimoiy tarmoqlarimizni kuzatib boring."
      },
    ]
  },
  {
    category: 'Ro\'yxatdan o\'tish va hisob',
    items: [
      {
        q: "Ro'yxatdan o'tish uchun nima kerak?",
        a: "Ro'yxatdan o'tish juda oson — sizga faqat login (foydalanuvchi nomi) va parol kifoya. Bir necha soniyada hisob yaratib, platformadan foydalanishni boshlashingiz mumkin."
      },
      {
        q: "Elektron pochta (email) kiritish majburiymi?",
        a: "Yo'q, email kiritish majburiy emas. U faqat parolni unutgan taqdiringizda uni tiklash uchun asqotadi. Shu sababli, hisobingiz xavfsizligi uchun email qo'shib qo'yishni tavsiya qilamiz — bu ortiqcha tashvishlardan saqlaydi."
      },
      {
        q: "Parolimni unutib qo'ysam, nima qilaman?",
        a: "Xavotir olmang. Kirish sahifasidagi «Parolni unutdingizmi?» tugmasini bosing — email manzilingizga maxsus tiklash kodi yuboriladi va siz yangi parol o'rnatasiz. Agar hisobingizga email biriktirilmagan bo'lsa, ijtimoiy tarmoqlarimiz orqali biz bilan bog'laning, yordam beramiz."
      },
    ]
  },
  {
    category: "E'lonlar",
    items: [
      {
        q: "E'lon joylash uchun to'lov kerakmi?",
        a: "Yo'q, e'lon joylash mutlaqo bepul. Huquqiy yordam izlayotgan bo'lsangiz yoki o'z xizmatlaringizni taklif qilmoqchi bo'lsangiz, bemalol e'lon joylashtiring."
      },
      {
        q: "E'lonni qanday joylashtiraman va boshqaraman?",
        a: "«E'lonlar» bo'limiga o'tib, «Yangi» tugmasini bosing. Kerakli yo'nalishlarni tanlang, tafsilotlarni kiriting va e'loningizni joylang. O'z e'lonlaringizni «Mening e'lonlarim» bo'limida istalgan vaqtda tahrirlashingiz yoki o'chirishingiz mumkin."
      },
      {
        q: "Qanday huquqiy yo'nalishlar mavjud?",
        a: "Platformada huquqning asosiy sohalari qamrab olingan: oilaviy, biznes, mulk, mehnat, soliq, jinoyat va shartnoma huquqi. Bitta e'longa bir nechta yo'nalish belgilashingiz mumkin — bu kerakli mutaxassisni topishni osonlashtiradi."
      },
    ]
  },
  {
    category: 'Yuristlar uchun',
    items: [
      {
        q: "Yurist sifatida qanday ro'yxatdan o'taman?",
        a: "Ro'yxatdan o'tishda «Yurist» rolini tanlang. So'ngra profilingizni to'ldiring: ish tajribangiz, ixtisosligingiz va o'zingiz haqingizdagi ma'lumotlarni kiriting. To'liq va aniq profil mijozlar ishonchini oshiradi va sizga ko'proq mijoz jalb qiladi."
      },
      {
        q: "Tasdiqlangan nishonni qanday olaman?",
        a: "Tasdiqlangan nishon — bu mijozlar oldidagi obro'ingiz kafolati. Uni olish uchun profilingizni to'ldirib, malakangizni tasdiqlovchi hujjatlar bilan ma'muriyatga murojaat qiling. Tekshiruvdan so'ng profilingizda maxsus belgi paydo bo'ladi va siz qidiruvda yuqori o'rinlarda ko'rinasiz."
      },
      {
        q: "Mijozlar bilan qanday ishlayman?",
        a: "Mijoz sizga yozganda «Suhbatlar» bo'limida xabar olasiz. Mijoz bilan to'g'ridan-to'g'ri yozishasiz, savollariga javob berasiz. Xizmat yakunlangach, mijoz sizga baho va sharh qoldiradi — bu reytingingizni oshiradi va kelajakda yangi mijozlar jalb qiladi."
      },
    ]
  },
  {
    category: 'Suhbat va sun\'iy intellekt',
    items: [
      {
        q: "Sun'iy intellekt maslahatchisiga ishonsa bo'ladimi?",
        a: "Yuristim AI O'zbekiston qonunchiligi asosida boshlang'ich yo'nalish berish uchun mo'ljallangan va u hozir sinov (beta) bosqichida. U umumiy savollarga tez javob beradi, biroq xato qilishi ham mumkin. Shu bois jiddiy va muhim huquqiy masalalarda albatta malakali yurist bilan maslahatlashing."
      },
      {
        q: "Suhbatlarim maxfiy saqlanadimi?",
        a: "Ha, yozishmalaringiz maxfiy. Suhbatni faqat siz va siz yozishayotgan yurist ko'ra oladi. Shaxsiy ma'lumotlaringiz xavfsizligi biz uchun ustuvor."
      },
      {
        q: "Yuristdan olgan xizmatimni qanday yakunlayman?",
        a: "Suhbat oynasidagi «Yakunlash» tugmasini bosing. So'ngra yuristga baho (yulduzlar) va sharh qoldirishingiz mumkin. Sizning fikringiz boshqa fuqarolarga to'g'ri tanlov qilishda yordam beradi va sifatli xizmatni rag'batlantiradi."
      },
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
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>Ko'p so'raladigan savollar</h1>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Eng ko'p so'raladigan savollarga javoblar</p>
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
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>Savolingizga javob topa olmadingizmi?</p>
        <a href="https://t.me/yuristim_online" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: '#fff', fontWeight: 600, fontSize: 13, padding: '10px 20px', borderRadius: 10, textDecoration: 'none' }}>
          <Send size={15} /> Telegram orqali so'rang
        </a>
      </div>
    </div>
  )
}
