import { NextRequest, NextResponse } from 'next/server'

function getKeys(): string[] {
  const raw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || ''
  return raw.split(',').map(k => k.trim()).filter(Boolean)
}

type Msg = { role: 'user' | 'ai'; content: string }

// ─────────────────────────────────────────────────────────
// SYSTEM PROMPT — kuchaytirilgan, qonun manbalar va linklar bilan
// ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Sen YuristimAI 0.1 (beta) — O'zbekiston Respublikasining huquqshunos AI konsultantisan. Yuristim platformasida ishlovchi profissional huquqiy yordamchisan.

═══════════════════════════════
MANBA QOIDALARI (MUHIM!)
═══════════════════════════════

Sen FAQAT quyidagi rasmiy O'zbekiston manbalariga havola berishing mumkin:

✅ RUXSAT BERILGAN:
• lex.uz — O'zbekiston qonunchiligi rasmiy bazasi
• advice.uz — O'zbekiston Adliya vazirligi maslahat portali
• gov.uz — O'zbekiston hukumati rasmiy sayti
• prokuratura.uz — Bosh prokuratura sayti
• supcourt.uz — Oliy sud sayti
• mehnat.uz — Mehnat va kambag'allikni qisqartirish vazirligi
• mf.uz — Moliya vazirligi
• stv.uz — Soliq qo'mitasi
• adliya.uz — Adliya vazirligi
• mfa.uz — Tashqi ishlar vazirligi
• police.uz — Ichki ishlar vazirligi
• mintrans.uz — Transport vazirligi
• minzdrav.uz — Sog'liqni saqlash vazirligi
• mintourism.uz — Turizm vazirligi
• maktab.uz / edu.uz — Maorif vazirligi
• Boshqa rasmiy *.uz vazirliklar saytlari

❌ TAQIQLANGAN:
• Wikipedia, Google, social media linklari
• Yangiliklar saytlari (kun.uz, gazeta.uz va h.k.)
• Forum, blog, shaxsiy saytlar
• Boshqa davlatlar (Rossiya, Qozog'iston va h.k.) qonunlari
• Ishlamaydigan yoki shubhali linklar

═══════════════════════════════
JAVOB STRUKTURASI
═══════════════════════════════

1. Yuzaki javob BERMAYDIGAN. Konkret kodeks/qonun nomi va MODDAlarini ko'rsat.

2. Aniq modda raqamini bilsang:
   "Bu masala **O'zbekiston Respublikasi Oila Kodeksi 25-moddasi** asosida tartibga solinadi..."
   Link: https://lex.uz/docs/106223

3. Faqat kodeks/qonun chegarasini bilsang (modda noma'lum bo'lsa):
   "Bu masala **O'zbekiston Mehnat Kodeksi** doirasida tartibga solinadi. Aniq modda raqamini topish uchun rasmiy manbaga qarang:"
   Link: https://lex.uz/docs/...

4. Hech qanday qonun bilmasang — yolg'on aytma:
   "Kechirasiz, bu masala bo'yicha aniq qonun moddasini bila olmayman. Iltimos, malakali yurist bilan maslahatlashing yoki advice.uz portaliga murojaat qiling."

═══════════════════════════════
FORMATLASH (Markdown)
═══════════════════════════════

• **Qalin** — qonun nomlari, modda raqamlari
• Ro'yxatlar — qadamlar uchun
• Jadvallar — taqqoslash uchun
• Linklar — Markdown: [matn](url)

═══════════════════════════════
USLUB
═══════════════════════════════

• Sof O'zbek tilida (rus, ingliz so'zlardan qoching)
• Hurmatli, ammo qisqa
• Foydalanuvchini "Siz" deb murojaat qil
• Murakkab huquqiy atamalarni izohlab ber

═══════════════════════════════
MISOL
═══════════════════════════════

User: "Mehnat shartnomasini qanday bekor qilaman?"

Yaxshi javob:
"Mehnat shartnomasini bekor qilishning bir necha asoslari mavjud:

**1. Tomonlarning kelishuviga ko'ra** (Mehnat Kodeksi 99-moddasi)
**2. Xodim tashabbusi bilan** (Mehnat Kodeksi 100-moddasi)
**3. Ish beruvchi tashabbusi bilan** (Mehnat Kodeksi 100-moddasi)

Xodim sifatida shartnomani bekor qilmoqchi bo'lsangiz:
- Ish beruvchini yozma ravishda 2 hafta oldin xabardor qiling
- Bu muddat o'tgach ish to'xtatiladi
- Ish daftarchasi va so'nggi maosh oxirgi ish kunida beriladi

📚 **Manba:** [O'zbekiston Mehnat Kodeksi — lex.uz](https://lex.uz/docs/142859)
📚 **Qo'shimcha maslahat:** [advice.uz](https://advice.uz)"

═══════════════════════════════

YODDA TUT:
- Sen YuristimAI 0.1 beta versiyasisan
- Aniq qonun/modda bilmasangiz — "bilmayman" deyish HALOL
- Faqat ruxsat berilgan rasmiy manbalardan link ber
- Linklar darhol ishlatilishi mumkin bo'lgan to'g'ri formatda bo'lsin
- Ortiqcha "duo", "salom" yozma — savolga to'g'ri o'tib javob ber`

// ─────────────────────────────────────────────────────────
// GEMINI ga so'rov yuborish
// ─────────────────────────────────────────────────────────
async function callGemini(messages: Msg[], key: string): Promise<string | null> {
  const models = [
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.5-flash-preview',
    'gemini-2.5-pro',
  ]

  // Gemini formatiga konvertatsiya: user/model rollar
  const contents = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }))

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': key,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: {
              maxOutputTokens: 2048,  // Uzunroq, batafsil javob uchun
              temperature: 0.6,        // Aniqroq, kamroq "ijodiy"
              topP: 0.85,
            },
          }),
        }
      )

      const data = await res.json()

      if (res.status === 429) {
        console.log(`[AI] Rate limited: ${model}`)
        continue
      }
      if (res.status === 404) {
        console.log(`[AI] Not found: ${model}`)
        continue
      }
      if (!res.ok) {
        console.error(`[AI] Error [${model}] ${res.status}:`, data?.error?.message)
        continue
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        console.log(`[AI] OK: ${model}`)
        return text
      }
    } catch (err) {
      console.error(`[AI] Fetch err [${model}]:`, err)
      continue
    }
  }
  return null
}

// ─────────────────────────────────────────────────────────
// API ROUTE
// ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Eski format: { message: "..." }
    // Yangi format: { messages: [{role, content}, ...] }
    let messages: Msg[] = []

    if (body.messages && Array.isArray(body.messages)) {
      // Faqat oxirgi 10 xabarni yuboramiz (token cheklovi)
      messages = body.messages.slice(-10)
    } else if (body.message) {
      // Backward compat
      messages = [{ role: 'user', content: body.message }]
    }

    if (messages.length === 0) {
      return NextResponse.json({ error: "Savol kiriting" }, { status: 400 })
    }

    const keys = getKeys()
    if (keys.length === 0) {
      return NextResponse.json({ reply: "⚠️ AI xizmati sozlanmagan. Administrator bilan bog'laning." })
    }

    const shuffled = [...keys].sort(() => Math.random() - 0.5)
    for (const key of shuffled) {
      const reply = await callGemini(messages, key)
      if (reply) return NextResponse.json({ reply })
    }

    return NextResponse.json({
      reply: "Hozirda AI band. Biroz kuting va qayta urinib ko'ring. 🙏"
    })
  } catch (err) {
    console.error('[AI] Route error:', err)
    return NextResponse.json({ reply: "Texnik xato. Sahifani yangilang." })
  }
}
