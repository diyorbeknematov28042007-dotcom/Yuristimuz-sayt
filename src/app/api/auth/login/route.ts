import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSession, setSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Login va parol kiriting" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('app_login', {
      p_username: username,
      p_password: password,
    })

    if (error) {
      return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 })
    }

    const user = data[0]
    const token = await createSession(user)
    await setSessionCookie(token)

    return NextResponse.json({ user })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
