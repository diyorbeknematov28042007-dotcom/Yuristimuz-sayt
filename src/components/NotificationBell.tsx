// ════════════════════════════════════════════════
// BILDIRISHNOMA QO'NG'IROQCHASI + PANEL (barqaror versiya)
// /src/components/NotificationBell.tsx
// ════════════════════════════════════════════════

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Bell, CheckCheck, FileText, ShieldCheck, MessageCircle,
  Star, Megaphone, Loader2
} from 'lucide-react'

type Notif = {
  id: string
  type: string
  title: string
  body: string
  link: string | null
  is_read: boolean
  created_at: string
  metadata: any
}

function notifVisual(type: string) {
  switch (type) {
    case 'ad_approved': return { icon: <FileText size={16} />, bg: '#dcfce7', c: '#16a34a' }
    case 'ad_rejected': return { icon: <FileText size={16} />, bg: '#fef2f2', c: '#dc2626' }
    case 'verification_approved': return { icon: <ShieldCheck size={16} />, bg: '#dbeafe', c: '#2563eb' }
    case 'verification_rejected': return { icon: <ShieldCheck size={16} />, bg: '#fef2f2', c: '#dc2626' }
    case 'new_message': return { icon: <MessageCircle size={16} />, bg: '#f0fdf4', c: '#16a34a' }
    case 'new_review': return { icon: <Star size={16} />, bg: '#fefce8', c: '#ca8a04' }
    default: return { icon: <Megaphone size={16} />, bg: '#f1f5f9', c: '#64748b' }
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'hozir'
  if (m < 60) return `${m} daqiqa oldin`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} soat oldin`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} kun oldin`
  return new Date(iso).toLocaleDateString('uz')
}

export default function NotificationBell({ userId, size = 18 }: { userId: string; size?: number }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Notif[]>([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Unread sonini olish (oddiy funksiya — ref/dependency muammosi yo'q)
  async function loadCount(uid: string) {
    try {
      const { data } = await supabase.rpc('get_user_notifications_count', { p_user_id: uid })
      setUnread(Number(data) || 0)
    } catch {}
  }

  async function loadList(uid: string) {
    setLoading(true)
    try {
      const { data } = await supabase.rpc('get_user_notifications', { p_user_id: uid, p_limit: 30 })
      setItems(data || [])
    } catch {}
    setLoading(false)
  }

  // ── Real-time: kanal FAQAT bir marta yaratiladi (userId o'zgarmasa) ──
  // open holati bu yerda ISHLATILMAYDI — shuning uchun kanal qayta yaratilmaydi
  useEffect(() => {
    if (!userId) return

    loadCount(userId)

    const channelName = `notifs_bell_${userId}_${Math.random().toString(36).slice(2, 8)}`
    const channel = supabase.channel(channelName)

    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      () => { loadCount(userId) }
    )

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Tashqariga bosilsa yopish
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const togglePanel = () => {
    const next = !open
    setOpen(next)
    if (next) loadList(userId)
  }

  const markAll = async () => {
    try {
      await supabase.rpc('mark_notifications_read', { p_user_id: userId, p_notification_ids: null })
    } catch {}
    setItems(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnread(0)
  }

  const clickNotif = async (n: Notif) => {
    if (!n.is_read) {
      try {
        await supabase.rpc('mark_notifications_read', { p_user_id: userId, p_notification_ids: [n.id] })
      } catch {}
      setItems(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x))
      setUnread(prev => Math.max(0, prev - 1))
    }
    if (n.link) {
      setOpen(false)
      router.push(n.link)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button ref={btnRef} onClick={togglePanel}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4, position: 'relative', display: 'flex' }}>
        <Bell size={size} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2, minWidth: 16, height: 16,
            background: '#dc2626', color: '#fff', borderRadius: 8, fontSize: 9.5, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
            border: '1.5px solid #fff',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div ref={panelRef} style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 340, maxWidth: '90vw', maxHeight: 440, background: '#fff',
          border: '0.5px solid #e2e8f0', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,0.16)',
          zIndex: 200, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '0.5px solid #f1f5f9' }}>
            <span style={{ fontWeight: 800, fontSize: 14.5, color: '#0f172a' }}>Bildirishnomalar</span>
            {unread > 0 && (
              <button onClick={markAll}
                style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#4338ca', fontSize: 11.5, fontWeight: 600, fontFamily: 'inherit' }}>
                <CheckCheck size={13} /> Hammasini o'qildi
              </button>
            )}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <Loader2 size={20} color="#cbd5e1" style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : items.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, background: '#f1f5f9', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Bell size={20} color="#94a3b8" />
                </div>
                <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Hozircha bildirishnoma yo'q</p>
                <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 4 }}>Muhim yangiliklar shu yerda ko'rinadi</p>
              </div>
            ) : (
              items.map(n => {
                const v = notifVisual(n.type)
                return (
                  <button key={n.id} onClick={() => clickNotif(n)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 11, width: '100%',
                      padding: '13px 16px', textAlign: 'left', cursor: n.link ? 'pointer' : 'default',
                      background: n.is_read ? '#fff' : '#f8faff', border: 'none',
                      borderBottom: '0.5px solid #f8fafc', fontFamily: 'inherit',
                    }}>
                    <div style={{ width: 34, height: 34, background: v.bg, color: v.c, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {v.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{n.title}</p>
                      <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.45, marginBottom: 4 }}>{n.body}</p>
                      <p style={{ fontSize: 10.5, color: '#94a3b8' }}>{timeAgo(n.created_at)}</p>
                    </div>
                    {!n.is_read && (
                      <span style={{ width: 7, height: 7, background: '#4338ca', borderRadius: '50%', flexShrink: 0, marginTop: 6 }} />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
