import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email kiriting" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('request_password_reset', {
      p_email: email,
    })

    if (error || !data || data.length === 0 || !data[0].success) {
      // Xavfsizlik uchun har doim "yuborildi" deymiz
      return NextResponse.json({ success: true })
    }

    const code = data[0].code

    // TODO: Real email yuborish (Resend yoki Supabase Edge Function)
    // Hozircha demo: kod konsolga chiqadi
    console.log('🔐 Password reset code:', email, '→', code)

    return NextResponse.json({ 
      success: true,
      // DEMO MODE: kodni qaytaramiz (production da olib tashlanadi)
      demo_code: process.env.NODE_ENV === 'production' ? undefined : code,
    })
  } catch (err) {
    console.error('Forgot password error:', err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
