import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession, createSession, setSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
    }

    const { avatar_url } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.rpc('update_user_avatar', {
      p_user_id: user.id,
      p_avatar_url: avatar_url || null,
    })

    if (error) {
      console.error('Avatar update error:', error)
      return NextResponse.json({ error: "Saqlashda xatolik" }, { status: 400 })
    }

    // JWT cookie ga avatar_url qo'shish (agar sidebar/topbar da kerak bo'lsa)
    const newToken = await createSession({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      avatar_url: avatar_url || null,
    })
    await setSessionCookie(newToken)

    return NextResponse.json({ success: true, avatar_url })
  } catch (err) {
    console.error('Avatar route error:', err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
