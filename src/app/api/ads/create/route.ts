// ════════════════════════════════════════════════
// E'LON YARATISH API (moderation bilan)
// /src/app/api/ads/create/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { patternCheck, geminiModeration, decideModeration } from '@/lib/ad-moderation'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      posterId,
      title,
      description,
      category,
      city,
      budgetMin,
      budgetMax,
    } = body
    
    // Validatsiya
    if (!posterId || !title || !description || !category) {
      return NextResponse.json(
        { error: 'Majburiy maydonlar to\'ldirilmagan' },
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
    
    // 1) Etika tasdiqlash holatini tekshirish
    const { data: termsAccepted } = await supabase.rpc('check_ad_terms_accepted', {
      p_user_id: posterId
    })
    
    if (!termsAccepted) {
      return NextResponse.json(
        { error: 'Avval e\'lon yozish qoidalariga rozi bo\'ling', needsTerms: true },
        { status: 403 }
      )
    }
    
    // 2) Foydalanuvchi rolini olish
    const { data: userData } = await supabase
      .from('app_users')
      .select('role')
      .eq('id', posterId)
      .single()
    
    if (!userData) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 })
    }
    
    const role = (userData.role === 'lawyer' ? 'lawyer' : 'client') as 'lawyer' | 'client'
    
    // 3) Moderatsiya — pattern check + Gemini
    const fullText = `${title}\n\n${description}`
    const pattern = patternCheck(fullText)
    const gemini = await geminiModeration(title, description, category, role)
    const decision = decideModeration(pattern, gemini, role)
    
    // 4) E'lon yaratish
    const { data: adId, error: createError } = await supabase.rpc('create_ad_with_moderation', {
      p_poster_id: posterId,
      p_title: title.trim(),
      p_description: description.trim(),
      p_category: category,
      p_city: city || null,
      p_budget_min: budgetMin || null,
      p_budget_max: budgetMax || null,
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
    
    // 5) Natijani qaytaramiz
    return NextResponse.json({
      success: true,
      adId,
      status: decision.status,
      message: getStatusMessage(decision.status, decision.reason),
      score: decision.score,  // debug uchun
    })
    
  } catch (err: any) {
    console.error('Ad create API xato:', err)
    return NextResponse.json(
      { error: err.message || 'Server xatosi' },
      { status: 500 }
    )
  }
}

function getStatusMessage(status: string, reason: string | null): string {
  switch (status) {
    case 'open':
      return 'E\'lon muvaffaqiyatli joylashtirildi!'
    case 'pending_review':
      return 'E\'lon yuborildi. Admin tomonidan tekshirilmoqda, 1-2 soatda javob beramiz.'
    case 'auto_rejected':
      return `E'lon rad etildi. ${reason || 'Sayt qoidalariga mos kelmadi.'} Iltimos, qoidalarni qayta o'qib, yangi e'lon yarating.`
    default:
      return 'E\'lon yaratildi'
  }
}
