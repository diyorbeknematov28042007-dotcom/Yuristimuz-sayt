import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

// VAPID sozlash (server start'da bir marta)
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:diyorbeknematov07@gmail.com'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

/**
 * POST /api/push/send
 *
 * Body: {
 *   userId: string         // qaysi user'ga jo'natiladi
 *   title: string          // bildirishnoma sarlavhasi
 *   body: string           // matn
 *   url?: string           // bosgach qayerga olib boradi
 *   tag?: string           // grouping (bir xil tag - eski almashtiriladi)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // ── HIMOYA: faqat ro'yxatdan o'tgan foydalanuvchi push yubora oladi ──
    // (tashqaridan spam push yuborishni oldini oladi)
    const sender = await getSession()
    if (!sender) {
      return NextResponse.json(
        { error: "Ruxsat yo'q" },
        { status: 401 }
      )
    }

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'VAPID kalitlari sozlanmagan. Environment variables tekshiring.' },
        { status: 500 }
      )
    }

    const { userId, title, body, url, tag } = await request.json()

    if (!userId || !title || !body) {
      return NextResponse.json(
        { error: 'userId, title va body majburiy' },
        { status: 400 }
      )
    }

    // Supabase'dan foydalanuvchining barcha subscription'larini olish
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: subs, error } = await supabase.rpc('get_user_push_subscriptions', {
      p_user_id: userId,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Subscription olishda xato: ' + error.message },
        { status: 500 }
      )
    }

    if (!subs || subs.length === 0) {
      return NextResponse.json(
        { sent: 0, message: 'Foydalanuvchi push notification\'ga obuna bo\'lmagan' },
        { status: 200 }
      )
    }

    // Har bir qurilmaga jo'natish (1 user'da bir nechta qurilma bo'lishi mumkin)
    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: tag || 'yuristim-msg',
      data: {
        url: url || '/dashboard/chat',
      },
    })

    const results = await Promise.allSettled(
      subs.map(async (sub: any) => {
        const subscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        }

        try {
          await webpush.sendNotification(subscription, payload)
          return { success: true, endpoint: sub.endpoint }
        } catch (err: any) {
          console.error('Push send error:', err.statusCode, err.body)

          // 410 = subscription o'chirilgan (eski qurilma)
          // 404 = subscription topilmadi
          if (err.statusCode === 410 || err.statusCode === 404) {
            // Bazadan tozalash
            await supabase.rpc('delete_push_subscription', {
              p_user_id: userId,
              p_endpoint: sub.endpoint,
            })
            return { success: false, endpoint: sub.endpoint, deleted: true }
          }

          return { success: false, endpoint: sub.endpoint, error: err.message }
        }
      })
    )

    const successful = results.filter(r =>
      r.status === 'fulfilled' && (r.value as any).success
    ).length

    return NextResponse.json({
      sent: successful,
      total: subs.length,
      results: results.map(r => r.status === 'fulfilled' ? r.value : { error: 'rejected' }),
    })
  } catch (err: any) {
    console.error('Push API error:', err)
    return NextResponse.json(
      { error: err.message || 'Server xatosi' },
      { status: 500 }
    )
  }
}
