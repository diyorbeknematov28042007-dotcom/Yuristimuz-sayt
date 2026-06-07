import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })

    const { title, description, category, city, budget_min, budget_max } = await request.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('create_ad', {
      p_user_id: user.id,
      p_title: title,
      p_description: description,
      p_category: category,
      p_city: city || null,
      p_budget_min: budget_min || null,
      p_budget_max: budget_max || null,
    })

    if (error) return NextResponse.json({ error: "E'lon yaratishda xatolik" }, { status: 400 })
    return NextResponse.json({ ad: data?.[0] })
  } catch (err) {
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
