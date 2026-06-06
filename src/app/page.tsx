import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">LegalUZ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-secondary text-sm">Kirish</Link>
            <Link href="/auth/signup" className="btn-primary text-sm">Ro'yxatdan o'tish</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Kerakli yuristni<br />tez toping
          </h1>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            O'zbekistondagi birinchi huquqiy xizmatlar platformasi.
            Bepul elon qo'ying yoki tajribali yuristlarni toping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup?role=client"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors">
              Yurist topish
            </Link>
            <Link href="/auth/signup?role=lawyer"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-xl transition-colors">
              Yurist sifatida kirish
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Nima uchun LegalUZ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🆓', title: 'Mijozlar uchun bepul', desc: 'Elon joylash, yuristlarni ko\'rish va ulар bilan gaplashish — barchasi bepul.' },
              { icon: '⚡', title: 'Tez va qulay', desc: 'Bir necha daqiqada kerakli yuristni toping va bog\'laning.' },
              { icon: '🔒', title: 'Ishonchli', desc: 'Barcha yuristlar tekshirilgan. Reyting va sharhlar asosida tanlang.' },
            ].map((f) => (
              <div key={f.title} className="card p-6 text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Qanday ishlaydi?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 text-blue-600">👤 Mijoz uchun</h3>
              {['Ro\'yxatdan o\'ting (bepul)', 'Elon joylang yoki yuristlarni ko\'ring', 'Yurist bilan bog\'laning', 'Muammoingizni yechin'].map((s, i) => (
                <div key={i} className="flex items-start gap-3 mb-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-gray-700 text-sm">{s}</span>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4 text-green-600">⚖️ Yurist uchun</h3>
              {['14 kun bepul sinab ko\'ring', 'Profil va elon yarating', 'Mijozlarga yozing (kredit bilan)', 'Pro tarifga o\'ting — cheksiz'].map((s, i) => (
                <div key={i} className="flex items-start gap-3 mb-3">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
                  <span className="text-gray-700 text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Bugunoq boshlang</h2>
        <p className="text-blue-100 mb-8">Ro'yxatdan o'tish bepul va bir daqiqa vaqt oladi</p>
        <Link href="/auth/signup" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 rounded-xl transition-colors inline-block">
          Bepul boshlash
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 text-sm">
        <p>© 2026 LegalUZ. Barcha huquqlar himoyalangan.</p>
        <p className="mt-1">Telegram: @lawyer_nematov</p>
      </footer>
    </main>
  )
}
