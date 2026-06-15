// ════════════════════════════════════════════════
// AD MODERATION HELPER
// /src/lib/ad-moderation.ts
// ════════════════════════════════════════════════

// ─────────────────────────────────────────
// Pattern check (yerli, bepul, ~5ms)
// ─────────────────────────────────────────

interface PatternResult {
  hasPhone: boolean
  hasCard: boolean
  hasExternalLink: boolean
  hasExcessiveCaps: boolean
  hasExcessivePunct: boolean
  spamKeywords: string[]
  flagCount: number  // umumiy bayroqlar soni
}

const SPAM_KEYWORDS = [
  // O'zbek
  'kredit ber', 'tez pul', 'oson pul', 'pul ishlash',
  'tezda pul', 'oson daromad', 'imkoniyat ber',
  'bepul kredit', 'tezkor kredit', 'foizsiz qarz',
  'investitsiya kerak', 'forex',
  // Rus
  'кредит', 'быстрые деньги', 'легкие деньги', 'заработок',
  // English
  'crypto', 'bitcoin', 'investment', 'loan', 'mlm',
  'pyramid', 'guaranteed return',
]

const ALLOWED_LINK_DOMAINS = [
  'lex.uz', 'gov.uz', 'advice.uz', 'sud.uz',
  'norma.uz', 'huquq.uz', 't.me', 'telegram.org',
]

export function patternCheck(text: string): PatternResult {
  const lower = text.toLowerCase()
  
  // Telefon raqami (UZ format va boshqa)
  const phoneRegex = /(\+?998[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2})|(\+?\d{10,15})/g
  const hasPhone = phoneRegex.test(text)
  
  // Karta raqami (16 raqam, ko'pincha 4-4-4-4)
  const cardRegex = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
  const hasCard = cardRegex.test(text)
  
  // Tashqi linklar (ruxsat etilgan domenlardan tashqari)
  const linkRegex = /https?:\/\/([a-z0-9-]+\.)+[a-z]{2,}/gi
  const matches = text.match(linkRegex) || []
  const externalLinks = matches.filter(url => {
    const domain = url.replace(/https?:\/\//, '').split('/')[0].toLowerCase()
    return !ALLOWED_LINK_DOMAINS.some(allowed => domain.endsWith(allowed))
  })
  const hasExternalLink = externalLinks.length > 0
  
  // Bosh harflar (HAMMASI BOSH HARFDA)
  const letters = text.replace(/[^a-zA-ZА-Яа-яЎўҚқҒғҲҳ]/g, '')
  const upperLetters = letters.replace(/[a-zа-яўқғҳ]/g, '')
  const hasExcessiveCaps = letters.length > 20 && upperLetters.length / letters.length > 0.6
  
  // Takroriy belgilar (!!!, ???, ...)
  const hasExcessivePunct = /[!?.]{4,}/.test(text)
  
  // Spam kalit so'zlar
  const spamKeywords = SPAM_KEYWORDS.filter(kw => lower.includes(kw))
  
  let flagCount = 0
  if (hasPhone) flagCount++
  if (hasCard) flagCount += 3  // karta — jiddiy
  if (hasExternalLink) flagCount += 2
  if (hasExcessiveCaps) flagCount++
  if (hasExcessivePunct) flagCount++
  flagCount += spamKeywords.length
  
  return {
    hasPhone,
    hasCard,
    hasExternalLink,
    hasExcessiveCaps,
    hasExcessivePunct,
    spamKeywords,
    flagCount,
  }
}

// ─────────────────────────────────────────
// Gemini moderation (huquqiy mavzu + toxic check)
// ─────────────────────────────────────────

interface GeminiResult {
  is_legal: boolean
  is_toxic: boolean
  category_match: boolean
  risk_score: number  // 0-100
  reason: string
}

const GEMINI_API_KEY = process.env.GEMINI_MODERATION_KEY || process.env.GEMINI_API_KEY || ''
const GEMINI_MODEL = 'gemini-2.5-flash'  // hozirgi tezkor model
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

const MODERATION_PROMPT = `Sen O'zbekiston huquqiy maslahat platformasining moderatorisan. Quyidagi e'lonni tahlil qil:

E'lon ma'lumotlari:
- Muallifning roli: {role}
- Sarlavha: {title}
- Tavsif: {description}
- Kategoriya: {category}

Quyidagi mezonlarni tekshir va aniq JSON formatda javob ber:
{
  "is_legal": bool,        // Bu huquqiy mavzu/savol/xizmatmi?
  "is_toxic": bool,        // Haqorat, tahdid, kamsitish bormi?
  "category_match": bool,  // Tanlangan kategoriya mos keladimi?
  "risk_score": number,    // 0-100 (0=xavfsiz, 100=jiddiy xavfli)
  "reason": "qisqa sabab"  // Agar risk yuqori bo'lsa, sabab. Aks holda bo'sh.
}

Muhim qoidalar:
- Sof reklama, spam, kredit takliflar — is_legal=false, risk=80+
- Firibgarlik belgilari (kafolat, oldindan to'lov) — risk=90+
- Haqorat, kamsitish — is_toxic=true, risk=70+
- Maxfiy ma'lumot (pasport, hujjat raqami) — risk=60+
- Sof huquqiy savol — is_legal=true, risk=0-20
- Mavzu va kategoriya mos kelmasligi — risk=30-50

Faqat JSON qaytaring, boshqa hech narsa qo'shmang.`

export async function geminiModeration(
  title: string,
  description: string,
  category: string,
  role: 'client' | 'lawyer'
): Promise<GeminiResult> {
  if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY yo\'q, moderation o\'tkazib yuborilmoqda')
    return {
      is_legal: true,
      is_toxic: false,
      category_match: true,
      risk_score: 0,
      reason: '',
    }
  }
  
  const prompt = MODERATION_PROMPT
    .replace('{role}', role === 'lawyer' ? 'Yurist (professional)' : 'Mijoz')
    .replace('{title}', title)
    .replace('{description}', description)
    .replace('{category}', category)
  
  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 200,
          responseMimeType: 'application/json',
        },
      }),
    })
    
    if (!response.ok) {
      console.error('Gemini API xato:', response.status)
      return {
        is_legal: true,
        is_toxic: false,
        category_match: true,
        risk_score: 0,
        reason: '',
      }
    }
    
    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    
    // JSON parse
    const cleaned = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned) as GeminiResult
    
    return {
      is_legal: Boolean(parsed.is_legal),
      is_toxic: Boolean(parsed.is_toxic),
      category_match: Boolean(parsed.category_match),
      risk_score: Math.max(0, Math.min(100, Number(parsed.risk_score) || 0)),
      reason: String(parsed.reason || ''),
    }
  } catch (err) {
    console.error('Gemini moderation xato:', err)
    // Xato bo'lsa, ehtiyotkorlik — pending review'ga jo'natamiz
    return {
      is_legal: true,
      is_toxic: false,
      category_match: true,
      risk_score: 35,  // O'rtacha — pending'a tushadi
      reason: 'AI tekshiruv vaqtinchalik ishlamadi',
    }
  }
}

// ─────────────────────────────────────────
// Yakuniy qaror
// ─────────────────────────────────────────

export interface ModerationDecision {
  status: 'open' | 'pending_review' | 'auto_rejected'
  score: number
  flags: any
  reason: string | null
  riskLevel: 'low' | 'medium' | 'high'  // YANGI — UI'da matn farqlash uchun
  needsAdminNotification: boolean        // YANGI — o'rta xavf admin'ga xabar
}

export function decideModeration(
  pattern: PatternResult,
  gemini: GeminiResult,
  role: 'client' | 'lawyer'
): ModerationDecision {
  // Boshlang'ich score
  let score = gemini.risk_score
  
  // Pattern flag'larini score'ga qo'shamiz
  // YURIST uchun: telefon/link ruxsat (score qo'shilmaydi)
  // MIJOZ uchun: telefon/link xavfli (score qo'shiladi)
  if (role === 'client') {
    if (pattern.hasPhone) score += 15
    if (pattern.hasExternalLink) score += 25
  }
  // Karta raqami — har kim uchun jiddiy
  if (pattern.hasCard) score += 50
  // Boshqalari — har kim uchun
  if (pattern.hasExcessiveCaps) score += 5
  if (pattern.hasExcessivePunct) score += 5
  score += pattern.spamKeywords.length * 10
  
  // Gemini flag'lari
  if (!gemini.is_legal) score += 30
  if (gemini.is_toxic) score += 40
  if (!gemini.category_match) score += 10
  
  // Cap
  score = Math.min(100, Math.max(0, score))
  
  // Flag'lar JSON
  const flags = {
    pattern: {
      hasPhone: pattern.hasPhone,
      hasCard: pattern.hasCard,
      hasExternalLink: pattern.hasExternalLink,
      hasExcessiveCaps: pattern.hasExcessiveCaps,
      hasExcessivePunct: pattern.hasExcessivePunct,
      spamKeywords: pattern.spamKeywords,
    },
    gemini: {
      is_legal: gemini.is_legal,
      is_toxic: gemini.is_toxic,
      category_match: gemini.category_match,
      gemini_score: gemini.risk_score,
      gemini_reason: gemini.reason,
    },
    final_score: score,
    role: role,
  }
  
  // ═══════════════════════════════════════════════════
  // YANGI MANTIQ — 3 ta xavf darajasi
  // ═══════════════════════════════════════════════════
  let status: 'open' | 'pending_review' | 'auto_rejected'
  let riskLevel: 'low' | 'medium' | 'high'
  let needsAdminNotification = false
  let reason: string | null = null
  
  // Threshold'lar rol asosida
  const lowMax = role === 'lawyer' ? 50 : 30      // Past xavf chegarasi
  const mediumMax = role === 'lawyer' ? 80 : 70   // O'rta xavf chegarasi
  
  if (score < lowMax) {
    // ✅ PAST XAVF — to'liq AI o'tkazadi
    status = 'open'
    riskLevel = 'low'
    needsAdminNotification = false
  } else if (score < mediumMax) {
    // ⚠️ O'RTA XAVF — joylandi LEKIN admin xabardor
    status = 'open'              // Saytda KO'RINADI
    riskLevel = 'medium'
    needsAdminNotification = true  // Admin tekshirsin
    reason = gemini.reason || 'O\'rta xavfli — admin tomonidan tekshiriladi'
  } else {
    // 🔴 YUQORI XAVF — admin tasdiqlamaguncha ko'rinmaydi
    status = 'pending_review'    // Saytda KO'RINMAYDI
    riskLevel = 'high'
    needsAdminNotification = true
    
    // Aniq sabablar (foydalanuvchi ko'radi)
    if (pattern.hasCard) reason = 'Karta raqami yozish taqiqlanadi'
    else if (!gemini.is_legal) reason = 'E\'lon huquqiy mavzuga oid emas'
    else if (gemini.is_toxic) reason = 'E\'londa haqorat yoki tahdid belgilari mavjud'
    else if (pattern.spamKeywords.length >= 2) reason = 'Spam belgilar aniqlandi'
    else reason = gemini.reason || 'AI tekshiruvi xavfli deb topdi'
  }
  
  return { status, score, flags, reason, riskLevel, needsAdminNotification }
}
