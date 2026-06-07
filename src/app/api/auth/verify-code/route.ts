import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email va kod kiriting" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('verify_reset_code', {
      p_email: email,
      p_code: code,
    })

    if (error || !data || data.length === 0 || !data[0].valid) {
      return NextResponse.json({ error: "Kod noto'g'ri yoki muddati tugagan" }, { status: 400 })
    }

    return NextResponse.json({ valid: true })
  } catch (err) {
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
