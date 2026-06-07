import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username || username.length < 3) {
      return NextResponse.json({ available: false, suggestions: [] })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('check_username', {
      p_username: username,
    })

    if (error || !data || data.length === 0) {
      return NextResponse.json({ available: false, suggestions: [] })
    }

    return NextResponse.json({
      available: data[0].available,
      suggestions: data[0].suggestions || [],
    })
  } catch (err) {
    return NextResponse.json({ available: false, suggestions: [] })
  }
}
