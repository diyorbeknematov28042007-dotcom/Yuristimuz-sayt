import { NextRequest, NextResponse } from 'next/server'

// Bir nechta Gemini API keylarni olish
function getKeys(): string[] {
  const raw = process.env.GEMINI_API_KEYS || ''
  return raw.split(',').map(k => k.trim()).filter(Boolean)
}

// Gemini ga so'rov yuborish — xato bo'lsa null qaytaradi
async function callGemini(message: string, key: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `Siz O'zbekiston qonunchiligini yaxshi biluvchi huquqiy konsultantsiz.
Faqat O'zbek tilida javob bering.
Qisqa, aniq va foydali javob yozing.
Agar mavjud bo'lsa, tegishli O'zbekiston qonunlari yoki normativ hujjatlariga havola keltiring.
Har doim javob oxirida quyidagini yozing:
"⚠️ Eslatma: Men xato qilishim mumkin. Aniq huquqiy masalalar uchun malakali yurist bilan maslahatlashing."
Bilmasangiz — "Bu savolga javob berishga qodir emasman" deb aniq ayting.`
            }]
          },
          contents: [{ role: 'user', parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          }
        })
      }
    )

    // Rate limit — keyinchi keyga o'tish uchun null
    if (res.status === 429) return null

    const data = await res.json()
    if (!res.ok) return null

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Savol kiriting" }, { status: 400 })
    }

    const keys = getKeys()

    if (keys.length === 0) {
      return NextResponse.json({
        reply: "AI xizmati hali sozlanmagan. Tez orada ishga tushadi! 🚀"
      })
    }

    // Keylarni tasodifiy tartibda sinab ko'ramiz
    const shuffled = [...keys].sort(() => Math.random() - 0.5)

    for (const key of shuffled) {
      const reply = await callGemini(message, key)
      if (reply) {
        return NextResponse.json({ reply })
      }
      // null = rate limit yoki xato — keyinchi keyga o'tadi
    }

    // Barcha keylar band yoki xato
    return NextResponse.json({
      reply: "Hozirda AI konsultant band. 1-2 daqiqadan so'ng qayta urinib ko'ring. 🙏"
    })

  } catch (err) {
    console.error('AI chat error:', err)
    return NextResponse.json({
      reply: "Texnik xato yuz berdi. Sahifani yangilang va qayta urinib ko'ring."
    })
  }
}
