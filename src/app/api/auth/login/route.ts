// ════════════════════════════════════════════════
// LOGIN API — blok tekshiruvi bilan
// /src/app/api/auth/login/route.ts
// ════════════════════════════════════════════════

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

    // ─── BLOK TEKSHIRUVI ───
    // Foydalanuvchi bloklangan bo'lsa, kirishni rad etamiz
    const { data: blockData } = await supabase
      .from('app_users')
      .select('is_blocked, blocked_until, blocked_reason')
      .eq('id', user.id)
      .single()

    if (blockData?.is_blocked) {
      // Vaqtinchalik blok muddati tugaganmi tekshiramiz
      const until = blockData.blocked_until ? new Date(blockData.blocked_until) : null
      const now = new Date()

      if (until && until < now) {
        // Muddat tugagan — avtomatik blokdan chiqaramiz
        await supabase
          .from('app_users')
          .update({ is_blocked: false, blocked_at: null, blocked_until: null, blocked_by: null, blocked_reason: null })
          .eq('id', user.id)
        // Kirishga ruxsat — davom etadi
      } else {
        // Hali bloklangan
        const reason = blockData.blocked_reason || 'Sayt qoidalarini buzganlik'
        const untilText = until
          ? ` Blok ${until.toLocaleDateString('uz-UZ')} gacha davom etadi.`
          : ' Blok doimiy.'
        return NextResponse.json(
          { error: `Akkauntingiz bloklangan. Sabab: ${reason}.${untilText}`, blocked: true },
          { status: 403 }
        )
      }
    }

    const token = await createSession(user)
    await setSessionCookie(token)

    return NextResponse.json({ user })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
