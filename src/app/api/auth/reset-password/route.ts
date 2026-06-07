import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ERRORS: Record<string, string> = {
  password_too_short: "Parol kamida 6 ta belgi bo'lishi kerak",
  invalid_or_expired_code: "Kod noto'g'ri yoki muddati tugagan",
}

export async function POST(request: NextRequest) {
  try {
    const { email, code, password } = await request.json()

    if (!email || !code || !password) {
      return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('complete_password_reset', {
      p_email: email,
      p_code: code,
      p_new_password: password,
    })

    if (error || !data || data.length === 0 || !data[0].success) {
      const message = data?.[0]?.message
      return NextResponse.json({ 
        error: ERRORS[message] || "Parolni o'zgartirib bo'lmadi" 
      }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
