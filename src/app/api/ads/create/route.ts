// ════════════════════════════════════════════════
// E'LON YARATISH API (moderation bilan) - TUZATILGAN
// /src/app/api/ads/create/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'
import { patternCheck, geminiModeration, decideModeration } from '@/lib/ad-moderation'

export async function POST(req: NextRequest) {
  try {
    // 1) Foydalanuvchi cookie'dan olish (xavfsiz)
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
    }

    const body = await req.json()
    
    // 2) Body'dan parametrlarni olish - snake_case yoki camelCase qabul qilamiz
    const title = (body.title || '').trim()
    const description = (body.description || '').trim()
    const category = body.category || ''
    const city = body.city || null
    const budgetMin = body.budget_min ?? body.budgetMin ?? null
    const budgetMax = body.budget_max ?? body.budgetMax ?? null

    // 3) Validatsiya
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Sarlavha, tavsif va kategoriya majburiy' },
        { status: 400 }
      )
    }
    if (title.length < 5 || title.length > 200) {
      return NextResponse.json(
        { error: 'Sarlavha 5-200 belgi oralig\'ida bo\'lishi kerak' },
        { status: 400 }
      )
    }
    if (description.length < 20 || description.length > 5000) {
      return NextResponse.json(
        { error: 'Tavsif 20-5000 belgi oralig\'ida bo\'lishi kerak' },
        { status: 400 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // 4) Etika tasdiqlash holatini tekshirish
    const { data: termsAccepted } = await supabase.rpc('check_ad_terms_accepted', {
      p_user_id: user.id,
    })

    if (!termsAccepted) {
      return NextResponse.json(
        { error: 'Avval e\'lon yozish qoidalariga rozi bo\'ling', needsTerms: true },
        { status: 403 }
      )
    }

    // 5) Foydalanuvchi roli (yurist/mijoz)
    const role = (user.role === 'lawyer' ? 'lawyer' : 'client') as 'lawyer' | 'client'

    // 6) Moderatsiya — pattern check + Gemini
    const fullText = `${title}\n\n${description}`
    const pattern = patternCheck(fullText)
    const gemini = await geminiModeration(title, description, category, role)
    const decision = decideModeration(pattern, gemini, role)

    // 7) E'lon yaratish
    const { data: adId, error: createError } = await supabase.rpc('create_ad_with_moderation', {
      p_poster_id: user.id,
      p_title: title,
      p_description: description,
      p_category: category,
      p_city: city,
      p_budget_min: budgetMin,
      p_budget_max: budgetMax,
      p_status: decision.status,
      p_moderation_score: decision.score,
      p_moderation_flags: decision.flags,
      p_moderation_reason: decision.reason,
    })

    if (createError) {
      console.error('E\'lon yaratish xato:', createError)
      return NextResponse.json(
        { error: 'E\'lon yaratishda xato: ' + createError.message },
        { status: 500 }
      )
    }

    // 8) Adminga bildirishnoma yuborish (o'rta va yuqori xavf uchun)
    if (decision.needsAdminNotification) {
      // Barcha admin'larga (hozir bitta admin bor, lekin kelajakda ko'p bo'lishi mumkin)
      const { data: adminUsers } = await supabase
        .from('app_users')
        .select('id')
        .eq('role', 'admin')
      
      if (adminUsers && adminUsers.length > 0) {
        const notificationTitle =
          decision.riskLevel === 'high'
            ? '🔴 Xavfli e\'lon tasdiqlash kutmoqda'
            : '🟡 Tekshirilishi kerak bo\'lgan e\'lon'
        
        const notificationBody =
          decision.riskLevel === 'high'
            ? `"${title.slice(0, 60)}${title.length > 60 ? '...' : ''}" — yuqori xavf (${decision.score}/100). Sayt'da ko'rinmaydi, tasdiqlanishi kerak.`
            : `"${title.slice(0, 60)}${title.length > 60 ? '...' : ''}" — o'rta xavf (${decision.score}/100). E'lon joylangan, lekin tekshirib chiqishingiz tavsiya etiladi.`
        
        // Har bir admin'ga bildirishnoma
        await Promise.all(
          adminUsers.map((admin: any) =>
            supabase.rpc('create_notification', {
              p_user_id: admin.id,
              p_type: decision.riskLevel === 'high' ? 'ad_high_risk' : 'ad_medium_risk',
              p_title: notificationTitle,
              p_body: notificationBody,
              p_link: `/admin/ads/${adId}`,
              p_metadata: { adId, score: decision.score, riskLevel: decision.riskLevel },
            })
          )
        )
      }
    }

    // 9) Foydalanuvchiga matn — xavf darajasi va status'ga qarab
    return NextResponse.json({
      success: true,
      adId,
      status: decision.status,
      riskLevel: decision.riskLevel,
      message: getStatusMessage(decision.riskLevel),
    })

  } catch (err: any) {
    console.error('Ad create API xato:', err)
    return NextResponse.json(
      { error: err.message || 'Server xatosi' },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────
// Foydalanuvchiga ko'rsatiladigan matn — xavf darajasi asosida
// ─────────────────────────────────────────
function getStatusMessage(riskLevel: 'low' | 'medium' | 'high'): string {
  switch (riskLevel) {
    case 'low':
      return 'Sizning e\'loningiz Yuristim AI tomonidan xavfsiz deb topildi va saytda joylashtirildi. ✓ Avtomatik tasdiqlandi.'
    
    case 'medium':
      return 'E\'loningiz saytda joylashtirildi. AI tomonidan tekshirilgan, lekin qo\'shimcha admin nazoratiga olindi. Agar muammoli topilsa, sabab bilan o\'chirilishi mumkin.'
    
    case 'high':
      return 'Sizning e\'loningiz Yuristim AI tomonidan xavfli deb topildi va admin tasdiqlash uchun yuborildi. Tasdiqlanmaguncha saytda ko\'rinmaydi. Admin tomonidan ko\'rib chiqilgach javob beramiz.'
    
    default:
      return 'E\'lon yaratildi'
  }
}
