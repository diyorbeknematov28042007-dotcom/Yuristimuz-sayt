import { NextRequest, NextResponse } from 'next/server'

function getKeys(): string[] {
  const raw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || ''
  return raw.split(',').map(k => k.trim()).filter(Boolean)
}

async function callGemini(message: string, key: string): Promise<string | null> {
  // gemini-1.5-flash — bepul, barcha keylar uchun ishlaydi
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest']
  
  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{
                text: `Siz O'zbekiston qonunchiligini yaxshi biluvchi huquqiy konsultantsiz. 
Faqat O'zbek tilida qisqa va aniq javob bering. 
Agar mavjud bo'lsa, O'zbekiston qonunlari yoki normativ hujjatlariga havola keltiring.
Javob oxirida: "⚠️ Eslatma: Men xato qilishim mumkin. Aniq masalalarda yurist bilan maslahatlashing." deb yozing.
Bilmasangiz aniq ayting.`
              }]
            },
            contents: [{ role: 'user', parts: [{ text: message }] }],
            generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
          })
        }
      )

      const data = await res.json()

      // Rate limit — keyinchi keyga o'tish
      if (res.status === 429) {
        console.log(`Rate limited on model ${model}`)
        break
      }

      if (!res.ok) {
        console.error(`Gemini error [${model}]:`, JSON.stringify(data))
        continue
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text

    } catch (err) {
      console.error(`Gemini fetch error [${model}]:`, err)
      continue
    }
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: "Savol kiriting" }, { status: 400 })
    }

    const keys = getKeys()

    if (keys.length === 0) {
      console.error('GEMINI_API_KEYS env var not set!')
      return NextResponse.json({
        reply: "⚠️ AI xizmati hali sozlanmagan. Administrator bilan bog'laning."
      })
    }

    // Keylarni tasodifiy tartibda sinab ko'rish
    const shuffled = [...keys].sort(() => Math.random() - 0.5)

    for (const key of shuffled) {
      const reply = await callGemini(message, key)
      if (reply) {
        return NextResponse.json({ reply })
      }
    }

    // Fallback — barcha keylar ishlamadi
    return NextResponse.json({
      reply: "Hozirda AI konsultant yuklanmoqda. Biroz kuting va qayta urinib ko'ring. 🙏\n\nAgar muammo davom etsa, @lawyer_nematov orqali bog'laning."
    })

  } catch (err) {
    console.error('AI chat route error:', err)
    return NextResponse.json({
      reply: "Texnik xato. Sahifani yangilang va qayta urinib ko'ring."
    })
  }
}
