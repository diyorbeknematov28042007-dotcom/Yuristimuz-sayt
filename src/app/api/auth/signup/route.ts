import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSession, setSessionCookie } from '@/lib/auth'

const ERROR_MESSAGES: Record<string, string> = {
  username_too_short: "Login kamida 3 ta belgi bo'lishi kerak",
  username_invalid_chars: "Login faqat lotin harflari, raqamlar va _ belgisi bo'lishi mumkin",
  password_too_short: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
  invalid_role: "Noto'g'ri rol",
  username_taken: "Bu login allaqachon band",
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, full_name, role } = await request.json()

    if (!username || !password || !full_name) {
      return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('app_signup', {
      p_username: username,
      p_password: password,
      p_full_name: full_name,
      p_role: role || 'client',
    })

    if (error) {
      const errorKey = error.message.replace(/^.*?:\s*/, '').trim()
      const message = ERROR_MESSAGES[errorKey] || "Xatolik yuz berdi"
      return NextResponse.json({ error: message }, { status: 400 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Hisob yaratilmadi" }, { status: 500 })
    }

    const user = data[0]
    const token = await createSession(user)
    await setSessionCookie(token)

    return NextResponse.json({ user })
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
