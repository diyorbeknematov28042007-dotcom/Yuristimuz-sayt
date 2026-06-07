import { NextRequest, NextResponse } from 'next/server'

function getKeys(): string[] {
  const raw = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || ''
  return raw.split(',').map(k => k.trim()).filter(Boolean)
}

async function callGemini(message: string, key: string): Promise<string | null> {
  const models = [
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.5-flash-preview',
    'gemini-2.5-pro',
  ]

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
            systemInstruction: {
              parts: [{
                text: `Sen Yuristim platformasining AI huquqiy konsultantisan. Foydalanuvchi bilan do'stona, oddiy va tushunarli tilda O'zbek tilida gaplash.

QOIDA:
- Oddiy, tushunarli O'zbek tilida yaz — murakkab yuridik atamalardan qoching yoki izohlang
- Markdown formatlashdan foydalanib yoz: **qalin** muhim so'zlar uchun, ## sarlavhalar uchun, - ro'yxatlar uchun, jadvallar uchun | | syntax
- Agar qonun moddasi mavjud bo'lsa, aniq ko'rsat: **O'zbekiston JK 97-moddasi** deb
- Javob qalin matnsiz ham aniq bo'lsin — formatlash faqat yordam uchun
- Bilmasang — "Bu haqida aniq bilmaymanki" de
- Har javob oxirida: "⚠️ Eslatma: Aniq huquqiy yordam uchun malakali yurist bilan maslahatlash tavsiya etiladi."

MISOL USLUB:
Foydalanuvchi: "Ish beruvchi ishimdan haqlisiz chiqarsa nima qilaman?"
Sen: "Qonunsiz ishdan bo'shatish bo'yicha quyidagilarni qilishingiz mumkin:\n\n1. **Ish beruvchidan** yozma buyruq/hujjat so'rang\n2. **Mehnat inspeksiyasiga** murojaat qiling (14 kun ichida)\n3. **Sudga** ariza bering — **O'zbekiston Mehnat Kodeksi 100-moddasi** bo'yicha\n\n⚠️ Eslatma: Aniq huquqiy yordam uchun malakali yurist bilan maslahatlash tavsiya etiladi."`,
              }]
            },
            contents: [{ role: 'user', parts: [{ text: message }] }],
            generationConfig: { maxOutputTokens: 1500, temperature: 0.8 }
          })
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

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    if (!message?.trim()) {
      return NextResponse.json({ error: "Savol kiriting" }, { status: 400 })
    }

    const keys = getKeys()
    if (keys.length === 0) {
      return NextResponse.json({ reply: "⚠️ AI xizmati sozlanmagan. Administrator bilan bog'laning." })
    }

    const shuffled = [...keys].sort(() => Math.random() - 0.5)
    for (const key of shuffled) {
      const reply = await callGemini(message, key)
      if (reply) return NextResponse.json({ reply })
    }

    return NextResponse.json({
      reply: "Hozirda AI band. Biroz kuting va qayta urinib ko'ring. 🙏"
    })
  } catch (err) {
    return NextResponse.json({ reply: "Texnik xato. Sahifani yangilang." })
  }
}
