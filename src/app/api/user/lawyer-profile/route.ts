import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
    if (user.role !== 'lawyer') return NextResponse.json({ error: 'Faqat yuristlar uchun' }, { status: 403 })

    const { specialization, experience_years, hourly_rate, description, languages, response_time } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.rpc('upsert_lawyer_profile', {
      p_user_id: user.id,
      p_specialization: specialization || null,
      p_experience_years: experience_years || null,
      p_hourly_rate: hourly_rate || null,
      p_description: description || null,
      p_languages: languages || null,
      p_response_time: response_time || null,
    })

    if (error) {
      console.error('Lawyer profile update:', error)
      return NextResponse.json({ error: "Saqlashda xatolik" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lawyer profile route error:', err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
