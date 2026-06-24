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
        "Ushbu Ommaviy offerta (bundan buyon — Shartnoma) Yuristim raqamli platformasi (yuristimuz-sayt.vercel.app, bundan buyon — Platforma) hamda undan foydalanuvchi jismoniy va yuridik shaxslar (bundan buyon — Foydalanuvchi) o'rtasidagi munosabatlarni tartibga soluvchi rasmiy taklif hisoblanadi.",
        "Platforma — bu huquqiy yordamga muhtoj shaxslar bilan malakali yuristlarni bog'lovchi, shuningdek sun'iy intellekt asosidagi dastlabki huquqiy maslahat beruvchi vositachi xizmatdir.",
        "Ro'yxatdan o'tish tugmasini bosish yoki Platformadan foydalanishni boshlash orqali Foydalanuvchi ushbu Shartnoma shartlarini to'liq o'qib chiqqanini, tushunganini va ularga so'zsiz rozilik bildirganini tasdiqlaydi.",
        "Agar Foydalanuvchi ushbu shartlarning biron qismiga rozi bo'lmasa, Platformadan foydalanishdan voz kechishi lozim.",
      ]
    },
    {
      num: '2',
      title: 'Asosiy tushunchalar',
      content: [
        "Mijoz — huquqiy yordam yoki maslahat olish maqsadida Platformadan foydalanuvchi shaxs.",
        "Yurist — o'z kasbiy xizmatlarini taklif qilish uchun Platformada ro'yxatdan o'tgan huquqshunos.",
        "AI Yurist — Platformaning sun'iy intellekt asosida ishlovchi, dastlabki umumiy huquqiy ma'lumot beruvchi avtomatlashtirilgan yordamchisi.",
        "Kontent — Foydalanuvchi tomonidan Platformaga joylashtirilgan har qanday ma'lumot: e'lonlar, xabarlar, profil ma'lumotlari, rasmlar va hujjatlar.",
        "Ma'muriyat — Platformani boshqaruvchi va texnik jihatdan ta'minlovchi shaxs yoki guruh.",
      ]
    },
    {
      num: '3',
      title: 'Sinov (beta) rejimi va cheklovlar',
      content: [
        "Platforma hozirda sinov (beta) bosqichida bo'lib, barcha asosiy xizmatlar Foydalanuvchilar uchun bepul taqdim etiladi.",
        "Sinov davri mobaynida texnik nosozliklar, ma'lumotlar vaqtincha mavjud bo'lmasligi yoki xizmatning to'xtab qolishi ehtimoli mavjud.",
        "Ma'muriyat oldindan xabar bermagan holda xizmatlarni o'zgartirish, vaqtincha to'xtatish, yangilash yoki butunlay bekor qilish huquqini saqlab qoladi.",
        "Foydalanuvchiga Platformada saqlanadigan muhim ma'lumotlarning zaxira nusxasini mustaqil ravishda saqlab borish tavsiya etiladi.",
        "Sinov rejimida taqdim etilgan funksiyalar yakuniy ko'rinishidan farq qilishi mumkin.",
      ]
    },
    {
      num: '4',
      title: "Ro'yxatdan o'tish va hisob xavfsizligi",
      content: [
        "Ro'yxatdan o'tishda Foydalanuvchi haqiqiy, to'g'ri va to'liq ma'lumotlarni kiritishi shart.",
        "Bir shaxs tomonidan boshqa shaxs nomidan ro'yxatdan o'tish yoki soxta ma'lumot kiritish qat'iyan taqiqlanadi.",
        "Foydalanuvchi o'z login va parolining maxfiyligini ta'minlash uchun shaxsan javobgardir.",
        "Hisobdan ruxsatsiz foydalanish aniqlansa, Foydalanuvchi zudlik bilan Ma'muriyatni xabardor qilishi lozim.",
        "Ma'muriyat shubhali yoki qoidalarga zid faoliyat aniqlangan hisoblarni vaqtincha to'xtatish yoki o'chirish huquqiga ega.",
      ]
    },
    {
      num: '5',
      title: 'Foydalanuvchi majburiyatlari',
      content: [
        "Platformada noqonuniy, haqoratli, kamsituvchi, yolg'on yoki zararli kontent joylashtirish taqiqlanadi.",
        "Boshqa Foydalanuvchilarning huquqlari, sha'ni va qadr-qimmatini hurmat qilish majburiy.",
        "Platformadan firibgarlik, spam tarqatish yoki noqonuniy reklama maqsadlarida foydalanish taqiqlanadi.",
        "Foydalanuvchi Platformaning texnik ishlashiga zarar yetkazuvchi har qanday harakatlardan (avtomatlashtirilgan so'rovlar, buzg'unchilik va h.k.) saqlanishi shart.",
        "Foydalanuvchi o'zi joylashtirgan barcha kontent uchun to'liq javobgardir.",
      ]
    },
    {
      num: '6',
      title: 'AI Yurist xizmatidan foydalanish',
      content: [
        "AI Yurist faqat umumiy va dastlabki huquqiy ma'lumot beradi — uning javoblari rasmiy yuridik maslahat hisoblanmaydi.",
        "AI tomonidan berilgan javoblar to'liq, aniq yoki dolzarb bo'lmasligi mumkin, shuning uchun ularga muhim qarorlar uchun yagona asos sifatida tayanish tavsiya etilmaydi.",
        "Har qanday jiddiy huquqiy masala bo'yicha malakali yurist yoki advokat bilan shaxsan maslahatlashish zarur.",
        "AI Yurist bilan bo'lishilgan ma'lumotlar xizmat sifatini yaxshilash maqsadida qayta ishlanishi mumkin — maxfiy yoki shaxsiy ma'lumotlarni kiritishda ehtiyot bo'ling.",
      ]
    },
    {
      num: '7',
      title: 'Yuristlar uchun maxsus shartlar',
      content: [
        "Yurist sifatida ro'yxatdan o'tgan shaxs o'z malakasi, ma'lumotlari va taqdim etgan hujjatlari to'g'riligini kafolatlaydi.",
        "Yurist o'zining kasbiy faoliyati, mijozga bergan maslahatlari va xizmatlari uchun to'liq va yakka tartibda javobgardir.",
        "Ma'muriyat yuristning kasbiy faoliyati natijalari uchun javobgar emas va yurist-mijoz munosabatlariga tomon bo'lmaydi.",
        "Profilda 'Tasdiqlangan' belgisini olish uchun yurist o'z malakasini tasdiqlovchi hujjatlarni taqdim etishi lozim. Belgi malaka tekshiruvidan o'tganlikni bildiradi, biroq xizmat sifatiga kafolat bermaydi.",
        "Yurist o'zi haqida yolg'on yoki chalg'ituvchi ma'lumot bergani aniqlansa, profili o'chirilishi mumkin.",
      ]
    },
    {
      num: '8',
      title: "E'lonlar va kontent",
      content: [
        "Foydalanuvchi joylashtirgan e'lonlar aniq, haqiqiy va qonuniy bo'lishi shart.",
        "Ma'muriyat qoidalarga zid, chalg'ituvchi yoki nomaqbul e'lonlarni oldindan xabar bermay o'chirish huquqiga ega.",
        "E'lonlar avtomatik va/yoki qo'lda moderatsiyadan o'tkazilishi mumkin.",
        "Foydalanuvchi o'z kontentini Platformada ko'rsatish uchun Ma'muriyatga zaruriy huquqlarni beradi, biroq kontentga bo'lgan mualliflik huquqi Foydalanuvchida qoladi.",
      ]
    },
    {
      num: '9',
      title: 'Joylashuv va xarita ma\'lumotlari',
      content: [
        "Yurist o'z ofisi yoki ish joyining manzilini xaritada ko'rsatish-ko'rsatmaslikni o'zi tanlaydi.",
        "Joylashuv ma'lumotlari faqat yurist roziligi asosida va u tomonidan kiritilgan holda ommaga ko'rsatiladi.",
        "Mijozning joriy joylashuvi yaqin-atrofdagi yuristlarni topish uchun ishlatilishi mumkin va uchinchi shaxslarga oshkor qilinmaydi.",
        "Xaritadagi ma'lumotlar taxminiy bo'lishi mumkin — aniq manzilni yurist bilan to'g'ridan-to'g'ri tasdiqlash tavsiya etiladi.",
      ]
    },
    {
      num: '10',
      title: "Shaxsiy ma'lumotlar va maxfiylik",
      content: [
        "Foydalanuvchi ma'lumotlari faqat Platforma xizmatlarini taqdim etish doirasida yig'iladi va ishlatiladi.",
        "Foydalanuvchi har bir profil maydonini ommaga ochiq yoki yashirin qilishni mustaqil boshqarishi mumkin.",
        "Ma'lumotlar Foydalanuvchining aniq roziligisiz uchinchi shaxslarga sotilmaydi yoki berilmaydi.",
        "Ma'muriyat ma'lumotlarni texnik ishlov berish, xavfsizlik va xizmat sifatini oshirish maqsadlarida qayta ishlash huquqini saqlab qoladi.",
        "Foydalanuvchi hisobini o'chirishni so'rasa, uning shaxsiy ma'lumotlari oqilona muddat ichida (taxminan 30 kun) tizimdan o'chiriladi.",
      ]
    },
    {
      num: '11',
      title: 'Ilova (PWA) va bildirishnomalar',
      content: [
        "Platforma qurilmaga ilova sifatida o'rnatilishi mumkin (PWA texnologiyasi) — bu ixtiyoriy va bepul.",
        "Mobil ilova ishlab chiqilmoqda; u tayyor bo'lguncha veb-ilova qurilmaning bosh ekranidan oddiy ilovadek ishlatilishi mumkin.",
        "Foydalanuvchi yangi xabarlar va muhim yangiliklar haqida bildirishnomalar olishga rozilik berishi yoki uni o'chirishi mumkin.",
        "Bildirishnomalarni qurilma sozlamalari yoki Platforma sozlamalari orqali istalgan vaqtda boshqarish mumkin.",
      ]
    },
    {
      num: '12',
      title: 'Mas\'uliyat cheklovi va risklar',
      content: [
        "Platforma sinov rejimida ishlamoqda — uzluksiz va xatosiz ishlash to'liq kafolatlanmaydi.",
        "Yuristim — bu vositachi platforma; u Foydalanuvchilar o'rtasidagi kelishuvlar, xizmatlar yoki nizolar uchun javobgar emas.",
        "Platforma orqali olingan har qanday maslahat (jumladan AI javoblari) rasmiy yuridik yordam o'rnini bosa olmaydi.",
        "Muhim huquqiy masalalarda litsenziyalangan advokat bilan shaxsan uchrashish qat'iy tavsiya etiladi.",
        "Ma'muriyat Foydalanuvchilarga yetkazilishi mumkin bo'lgan bilvosita, tasodifiy yoki oqibatli zararlar uchun javobgar emas.",
      ]
    },
    {
      num: '13',
      title: 'Shartlarning o\'zgarishi',
      content: [
        "Ma'muriyat ushbu Shartnoma shartlarini istalgan vaqtda bir tomonlama o'zgartirish huquqiga ega.",
        "Muhim o'zgarishlar haqida Foydalanuvchilar Platforma orqali xabardor qilinishga harakat qilinadi.",
        "O'zgarishlardan keyin Platformadan foydalanishni davom ettirish yangilangan shartlarga rozilik sifatida qabul qilinadi.",
        "Foydalanuvchiga ushbu hujjatni vaqti-vaqti bilan qayta o'qib turish tavsiya etiladi.",
      ]
    },
    {
      num: '14',
      title: 'Aloqa va murojaatlar',
      content: [
        "Shikoyat, taklif va savollar uchun Telegram: @lawyer_nematov",
        "Elektron pochta: diyorbeknematov07@gmail.com",
        "Murojaatlarga oqilona muddatda (odatda 3 ish kuni ichida) javob berishga harakat qilinadi.",
        "Ushbu Shartnoma bo'yicha kelib chiqadigan nizolar dastlab muzokaralar yo'li bilan, kelishuvga erishilmasa O'zbekiston Respublikasi qonunchiligiga muvofiq hal etiladi.",
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
            <span style={{ fontSize: 11, background: '#fff7ed', color: '#c2410c', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>Sinov (beta) rejimi</span>
            <span style={{ fontSize: 11, background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: 6, fontWeight: 600 }}>Bepul xizmat</span>
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

        {/* Eslatma */}
        <div style={{ marginTop: 20, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 14, padding: '16px 20px' }}>
          <p style={{ fontSize: 12.5, color: '#9a3412', lineHeight: 1.6 }}>
            Ushbu hujjat sinov bosqichidagi platforma uchun tuzilgan bo'lib, takomillashtirilib boriladi. Foydalanuvchilarga uni vaqti-vaqti bilan qayta ko'rib chiqish tavsiya etiladi.
          </p>
        </div>

        {/* Footer CTA */}
        <div style={{ marginTop: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: '20px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#166534', marginBottom: 12 }}>Shartlarni qabul qilib ro'yxatdan o'ting</p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 11, textDecoration: 'none' }}>
            Ro'yxatdan o'tish →
          </Link>
        </div>
      </main>
    </div>
  )
}
