import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession, createSession, setSessionCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
    }

    const { full_name, email, phone, city, bio } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.rpc('update_user_profile', {
      p_user_id: user.id,
      p_full_name: full_name || null,
      p_email: email || null,
      p_phone: phone || null,
      p_city: city || null,
      p_bio: bio || null,
    })

    if (error) {
      return NextResponse.json({ error: "Saqlashda xatolik" }, { status: 400 })
    }

    // 🔄 full_name o'zgargan bo'lsa — JWT cookie ni yangilash
    // (sidebar va boshqa joylarda darhol yangi ism ko'rinsin)
    if (full_name && full_name !== user.full_name) {
      const newToken = await createSession({
        id: user.id,
        username: user.username,
        full_name,
        role: user.role,
      })
      await setSessionCookie(newToken)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Profile update error:', err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
