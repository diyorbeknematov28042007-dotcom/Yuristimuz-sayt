// ════════════════════════════════════════════════
// PAROL TIKLASH — kod yuborish (Resend email bilan)
// /src/app/api/auth/forgot-password/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Resend orqali email yuborish (paket kerak emas — fetch ishlatamiz)
async function sendResetEmail(email: string, code: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false  // Kalit yo'q — email yuborilmaydi (demo rejim)

  // Yuboruvchi manzil: Resend test domeni yoki o'z domeningiz
  const from = process.env.RESEND_FROM || 'Yuristim <onboarding@resend.dev>'

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: 'Yuristim — parolni tiklash kodi',
        html: `
          <div style="font-family: -apple-system, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: linear-gradient(135deg,#0f172a,#4338ca); color: #fff; width: 52px; height: 52px; line-height: 52px; border-radius: 14px; font-size: 24px; font-weight: 800;">Y</div>
            </div>
            <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; text-align: center; margin: 0 0 8px;">Parolni tiklash</h1>
            <p style="font-size: 14px; color: #64748b; text-align: center; line-height: 1.6; margin: 0 0 28px;">
              Hisobingiz parolini tiklash uchun quyidagi kodni kiriting. Kod 15 daqiqa amal qiladi.
            </p>
            <div style="background: #f1f5f9; border-radius: 14px; padding: 24px; text-align: center; margin-bottom: 28px;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f172a; font-family: monospace;">${code}</span>
            </div>
            <p style="font-size: 12.5px; color: #94a3b8; text-align: center; line-height: 1.6; margin: 0;">
              Agar siz parolni tiklashni so'ramagan bo'lsangiz, bu xabarni e'tiborsiz qoldiring.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0 16px;" />
            <p style="font-size: 11.5px; color: #cbd5e1; text-align: center; margin: 0;">
              Yuristim — O'zbekiston yuristlari platformasi
            </p>
          </div>
        `,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

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
      // Xavfsizlik uchun har doim "yuborildi" deymiz (email mavjudligini oshkor qilmaymiz)
      return NextResponse.json({ success: true })
    }

    const code = data[0].code

    // Email yuborish
    const sent = await sendResetEmail(email, code)

    // Agar email yuborilmasa (kalit yo'q) — dev rejimda kodni qaytaramiz
    return NextResponse.json({
      success: true,
      emailSent: sent,
      demo_code: (!sent && process.env.NODE_ENV !== 'production') ? code : undefined,
    })
  } catch (err) {
    console.error('Forgot password error:', err)
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 })
  }
}
