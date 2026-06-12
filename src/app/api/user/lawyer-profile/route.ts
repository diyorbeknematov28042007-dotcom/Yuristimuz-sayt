import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
    if (user.role !== 'lawyer') return NextResponse.json({ error: 'Faqat yuristlar uchun' }, { status: 403 })

    const body = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.rpc('upsert_lawyer_profile', {
      p_user_id: user.id,
      // Eskilari (asosiy)
      p_specialization: body.specialization || null,
      p_experience_years: body.experience_years || null,
      p_hourly_rate: body.hourly_rate || null,
      p_description: body.description || null,
      p_languages: body.languages || null,
      p_response_time: body.response_time || null,
      // Yangilari — Faza 1.3
      p_workplace: body.workplace || null,
      p_job_title: body.job_title || null,
      p_education_university: body.education_university || null,
      p_education_year: body.education_year || null,
      p_diploma_url: body.diploma_url || null,
      p_certificates: body.certificates || null,
      p_license_number: body.license_number || null,
      p_license_authority: body.license_authority || null,
      p_license_valid_until: body.license_valid_until || null,
      p_social_telegram: body.social_telegram || null,
      p_social_linkedin: body.social_linkedin || null,
      p_website: body.website || null,
      p_public_phone: body.public_phone || null,
    })

    if (error) {
      console.error('Lawyer profile update:', error)
      return NextResponse.json({ error: "Saqlashda xatolik: " + error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lawyer profile route error:', err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
