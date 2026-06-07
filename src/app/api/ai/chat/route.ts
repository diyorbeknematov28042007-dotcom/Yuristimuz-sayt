import { NextRequest, NextResponse } from 'next/server'

function getKeys(): string[] {
  const raw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || ''
  return raw.split(',').map(k => k.trim()).filter(Boolean)
}

async function callGemini(message: string, key: string): Promise<string | null> {
  // 2026 da ishlaydigan bepul modellar (eng yaxshidan boshlab)
  const models = [
    'gemini-2.5-flash-lite',    // 15 RPM, 1000 RPD — eng ko'p bepul limit
    'gemini-2.5-flash',         // 10 RPM, 250 RPD
    'gemini-2.5-flash-preview', // zaxira
    'gemini-2.5-pro',           // 5 RPM, 100 RPD
  ]

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key,  // header orqali (query param ham qo'shamiz)
        },
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
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          }
        })
      })

      const data = await res.json()

      if (res.status === 429) {
        // Rate limit — keyinchi modelga yoki keyga o'tish
        console.log(`[AI] Rate limited: ${model}`)
        continue
      }

      if (res.status === 404) {
        // Model topilmadi — keyinchi model
        console.log(`[AI] Model not found: ${model}, trying next...`)
        continue
      }

      if (!res.ok) {
        const errMsg = data?.error?.message || JSON.stringify(data)
        console.error(`[AI] Error [${model}] ${res.status}:`, errMsg)
        continue
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        console.log(`[AI] Success with model: ${model}`)
        return text
      }

    } catch (err) {
      console.error(`[AI] Fetch error [${model}]:`, err)
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
      console.error('[AI] GEMINI_API_KEYS env var not set!')
      return NextResponse.json({
        reply: "⚠️ AI xizmati sozlanmagan. Administrator bilan bog'laning."
      })
    }

    console.log(`[AI] Got ${keys.length} key(s), processing...`)

    // Keylarni tasodifiy tartibda sinab ko'rish (load balancing)
    const shuffled = [...keys].sort(() => Math.random() - 0.5)

    for (const key of shuffled) {
      const reply = await callGemini(message, key)
      if (reply) {
        return NextResponse.json({ reply })
      }
    }

    return NextResponse.json({
      reply: "Hozirda AI konsultant band. Biroz kuting va qayta urinib ko'ring. 🙏"
    })

  } catch (err) {
    console.error('[AI] Route error:', err)
    return NextResponse.json({
      reply: "Texnik xato. Sahifani yangilang va qayta urinib ko'ring."
    })
  }
}
