'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type NotificationContextType = {
  totalUnread: number
  conversationsWithUnread: number
  unreadByConversation: Map<string, number>
  refresh: () => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
  // Toast bildirishnoma
  showToast: (message: ToastData) => void
  // Settings
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
}

type ToastData = {
  id: string
  senderName: string
  senderAvatar: string | null
  content: string
  conversationId: string
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({
  userId,
  children
}: {
  userId: string | null
  children: React.ReactNode
}) {
  const [totalUnread, setTotalUnread] = useState(0)
  const [conversationsWithUnread, setConversationsWithUnread] = useState(0)
  const [unreadByConversation, setUnreadByConversation] = useState<Map<string, number>>(new Map())
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [soundEnabled, setSoundEnabledState] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const soundEnabledRef = useRef(true)  // kanal closure uchun

  // soundEnabled o'zgarsa ref ham yangilanadi
  useEffect(() => { soundEnabledRef.current = soundEnabled }, [soundEnabled])

  // localStorage dan sound setting yuklash
  useEffect(() => {
    const saved = localStorage.getItem('yuristim_sound_enabled')
    if (saved !== null) {
      setSoundEnabledState(saved === 'true')
    }
  }, [])

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled)
    localStorage.setItem('yuristim_sound_enabled', String(enabled))
  }, [])

  // Unread count'ni yuklash
  const refresh = useCallback(async () => {
    if (!userId) return

    const [{ data: total }, { data: perConv }] = await Promise.all([
      supabase.rpc('get_unread_count', { p_user_id: userId }),
      supabase.rpc('get_unread_by_conversation', { p_user_id: userId }),
    ])

    if (total?.[0]) {
      setTotalUnread(Number(total[0].total_unread))
      setConversationsWithUnread(Number(total[0].conversations_with_unread))
    }

    if (perConv) {
      const map = new Map<string, number>()
      perConv.forEach((row: any) => {
        map.set(row.conversation_id, Number(row.unread_count))
      })
      setUnreadByConversation(map)
    }
  }, [userId])

  // Xabarlarni o'qildi deb belgilash
  const markAsRead = useCallback(async (conversationId: string) => {
    if (!userId) return
    await supabase.rpc('mark_messages_as_read', {
      p_user_id: userId,
      p_conversation_id: conversationId,
    })
    await refresh()
  }, [userId, refresh])

  // Toast ko'rsatish
  const showToast = useCallback((toast: ToastData) => {
    setToasts(prev => [...prev, toast])
    // 5 sekunddan keyin avtomatik o'chirish
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id))
    }, 5000)
  }, [])

  // Audio object yaratish
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Notification sound (kichik pop)
      audioRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQA=')
      audioRef.current.volume = 0.3
    }
  }, [])

  // Realtime subscription — yangi xabarlar
  useEffect(() => {
    if (!userId) return

    refresh()

    const channel = supabase
      .channel(`notifications_ctx_${userId}_${Math.random().toString(36).slice(2, 8)}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload: any) => {
          const newMsg = payload.new

          // O'zim yuborgan bo'lsa - skip
          if (newMsg.sender_id === userId) return

          // Bu xabar menga taalluqlimi tekshirish
          const { data: conv } = await supabase
            .from('conversations')
            .select('client_id, lawyer_id')
            .eq('id', newMsg.conversation_id)
            .single()

          if (!conv) return
          if (conv.client_id !== userId && conv.lawyer_id !== userId) return

          // Sender ma'lumotini olish
          const { data: msgData } = await supabase.rpc('get_message_with_sender', {
            p_message_id: newMsg.id,
          })

          if (msgData?.[0]) {
            const sender = msgData[0]

            // Toast ko'rsatish (faqat chat sahifasida emas)
            if (!window.location.pathname.includes('/chat')) {
              showToast({
                id: newMsg.id,
                senderName: sender.sender_full_name || sender.sender_username,
                senderAvatar: sender.sender_avatar_url,
                content: sender.content,
                conversationId: newMsg.conversation_id,
              })

              // Ovoz signali
              if (soundEnabledRef.current && audioRef.current) {
                audioRef.current.play().catch(() => {})
              }
            }
          }

          // Counter yangilash
          await refresh()
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Tab title yangilash
  useEffect(() => {
    if (typeof document === 'undefined') return
    const baseTitle = document.title.replace(/^\(\d+\)\s/, '')
    if (totalUnread > 0) {
      document.title = `(${totalUnread}) ${baseTitle}`
    } else {
      document.title = baseTitle
    }
  }, [totalUnread])

  // Favicon dot
  useEffect(() => {
    if (typeof document === 'undefined') return

    const updateFavicon = () => {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (!link) return

      if (totalUnread === 0) {
        link.href = '/favicon.ico'
        return
      }

      // Canvas bilan qizil nuqta qo'shish
      const canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 32, 32)
        // Qizil dot
        ctx.beginPath()
        ctx.arc(24, 8, 7, 0, 2 * Math.PI)
        ctx.fillStyle = '#ef4444'
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 1.5
        ctx.stroke()
        link.href = canvas.toDataURL()
      }
      img.src = '/favicon.ico'
    }

    updateFavicon()
  }, [totalUnread])

  return (
    <NotificationContext.Provider value={{
      totalUnread, conversationsWithUnread, unreadByConversation,
      refresh, markAsRead, showToast,
      soundEnabled, setSoundEnabled,
    }}>
      {children}
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    // Default values agar provider yo'q bo'lsa
    return {
      totalUnread: 0,
      conversationsWithUnread: 0,
      unreadByConversation: new Map(),
      refresh: async () => {},
      markAsRead: async () => {},
      showToast: () => {},
      soundEnabled: true,
      setSoundEnabled: () => {},
    }
  }
  return ctx
}

// ─────────────────────────────────────────
// Toast UI komponenti
// ─────────────────────────────────────────
function ToastContainer({
  toasts,
  onClose
}: {
  toasts: ToastData[]
  onClose: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: 20, right: 20,
      zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.slice(-3).map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: ToastData; onClose: () => void }) {
  const ini = (n: string) => n?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <a
      href={`/dashboard/chat?conv=${toast.conversationId}`}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px',
        background: '#fff',
        border: '0.5px solid #e2e8f0',
        borderRadius: 14,
        boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
        minWidth: 300, maxWidth: 380,
        textDecoration: 'none',
        pointerEvents: 'auto',
        animation: 'slideInRight 0.3s cubic-bezier(.4,0,.2,1)',
        cursor: 'pointer',
      }}>
      {/* Avatar */}
      {toast.senderAvatar ? (
        <img src={toast.senderAvatar} alt={toast.senderName}
          style={{ width: 38, height: 38, borderRadius: 11, objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{
          width: 38, height: 38,
          background: 'linear-gradient(135deg, #0f172a, #4338ca)',
          color: '#fff', borderRadius: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>
          {ini(toast.senderName)}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
          {toast.senderName}
        </p>
        <p style={{
          fontSize: 12, color: '#64748b',
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
          lineHeight: 1.5,
        }}>
          {toast.content}
        </p>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(110%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </a>
  )
}
