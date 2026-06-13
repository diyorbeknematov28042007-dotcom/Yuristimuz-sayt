'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Bot, Send, ArrowLeft, BadgeCheck, Star, Sparkles, CheckCheck, Loader2, Plus, AlertTriangle, ArrowRight, Search, X, Bell, Archive, ArchiveRestore, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useNotifications } from '@/contexts/NotificationContext'

// =============================================
// MARKDOWN RENDERER — **bold**, *italic*, jadvallar, ro'yxatlar
// =============================================
function renderInline(text: string, key = 0): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  // [matn](url) — Markdown linklar VA **bold**, *italic*, `code`
  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g
  let last = 0, m: RegExpExecArray | null, k = key * 1000

  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={k++}>{text.slice(last, m.index)}</span>)
    if (m[0].startsWith('[')) {
      // Markdown link [matn](url)
      parts.push(
        <a key={k++} href={m[3]} target="_blank" rel="noopener noreferrer"
          style={{ color: '#4338ca', textDecoration: 'underline', fontWeight: 600 }}>
          {m[2]}
        </a>
      )
    }
    else if (m[0].startsWith('**'))
      parts.push(<strong key={k++} style={{ fontWeight: 700 }}>{m[4]}</strong>)
    else if (m[0].startsWith('*'))
      parts.push(<em key={k++} style={{ fontStyle: 'italic' }}>{m[5]}</em>)
    else if (m[0].startsWith('`'))
      parts.push(<code key={k++} style={{ background: 'rgba(0,0,0,0.08)', padding: '1px 6px', borderRadius: 4, fontSize: '0.88em', fontFamily: 'ui-monospace, monospace' }}>{m[6]}</code>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(<span key={k++}>{text.slice(last)}</span>)
  return parts.length ? parts : [<span key={k}>{text}</span>]
}

function MarkdownMessage({ content, isAI }: { content: string; isAI: boolean }) {
  const bg = isAI ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.15)'
  const border = isAI ? '#e2e8f0' : 'transparent'
  const textClr = isAI ? '#1e293b' : '#fff'

  const blocks: React.ReactNode[] = []
  const lines = content.split('\n')
  let i = 0, k = 0

  while (i < lines.length) {
    const line = lines[i]
    const t = line.trim()

    if (!t) { i++; continue }

    // Headings
    if (t.startsWith('### ')) {
      blocks.push(<p key={k++} style={{ fontWeight: 700, fontSize: 14.5, margin: '10px 0 4px 0', color: textClr }}>{renderInline(t.slice(4), k)}</p>)
      i++; continue
    }
    if (t.startsWith('## ')) {
      blocks.push(<p key={k++} style={{ fontWeight: 800, fontSize: 15.5, margin: '12px 0 5px 0', color: textClr }}>{renderInline(t.slice(3), k)}</p>)
      i++; continue
    }
    if (t.startsWith('# ')) {
      blocks.push(<p key={k++} style={{ fontWeight: 800, fontSize: 17, margin: '12px 0 5px 0', color: textClr }}>{renderInline(t.slice(2), k)}</p>)
      i++; continue
    }

    // Horizontal rule
    if (t === '---' || t === '***') {
      blocks.push(<hr key={k++} style={{ border: 'none', borderTop: `0.5px solid ${isAI ? '#e2e8f0' : 'rgba(255,255,255,0.2)'}`, margin: '10px 0' }} />)
      i++; continue
    }

    // Table
    if (t.startsWith('|') && t.endsWith('|')) {
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const row = lines[i].trim()
        if (!row.includes('---')) {
          rows.push(row.split('|').filter(c => c.trim()).map(c => c.trim()))
        }
        i++
      }
      if (rows.length > 0) {
        blocks.push(
          <div key={k++} style={{ overflowX: 'auto', margin: '8px 0', borderRadius: 10, overflow: 'hidden', border: `0.5px solid ${isAI ? '#e2e8f0' : 'rgba(255,255,255,0.2)'}` }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
              <thead>
                <tr>{rows[0].map((h, j) => (
                  <th key={j} style={{ padding: '8px 12px', background: isAI ? '#0f172a' : 'rgba(255,255,255,0.2)', color: isAI ? '#fff' : '#fff', fontWeight: 700, textAlign: 'left', whiteSpace: 'nowrap' }}>
                    {renderInline(h, k + j)}
                  </th>
                ))}</tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, j) => (
                  <tr key={j} style={{ background: j % 2 === 0 ? (isAI ? '#fafafa' : 'rgba(255,255,255,0.05)') : (isAI ? '#fff' : 'transparent') }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: '7px 12px', borderBottom: `0.5px solid ${isAI ? '#f1f5f9' : 'rgba(255,255,255,0.1)'}`, color: textClr }}>
                        {renderInline(cell, k + j * 10 + ci)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
      continue
    }

    // Bullet list
    if (t.startsWith('- ') || t.startsWith('• ') || (t.startsWith('* ') && !t.startsWith('**'))) {
      const items: string[] = []
      while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('• ') || (lines[i].trim().startsWith('* ') && !lines[i].trim().startsWith('**')))) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      blocks.push(
        <ul key={k++} style={{ paddingLeft: 18, margin: '6px 0', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize: 13.5, lineHeight: 1.65, color: textClr }}>
              {renderInline(item, k + j)}
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered list
    if (/^\d+[\.\)]\s/.test(t)) {
      const items: string[] = []
      while (i < lines.length && /^\d+[\.\)]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[\.\)]\s/, ''))
        i++
      }
      blocks.push(
        <ol key={k++} style={{ paddingLeft: 20, margin: '6px 0', display: 'flex', flexDirection: 'column', gap: 5 }}>
          {items.map((item, j) => (
            <li key={j} style={{ fontSize: 13.5, lineHeight: 1.65, color: textClr }}>
              {renderInline(item, k + j)}
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Blockquote
    if (t.startsWith('> ')) {
      blocks.push(
        <div key={k++} style={{ borderLeft: `3px solid ${isAI ? '#6366f1' : 'rgba(255,255,255,0.4)'}`, paddingLeft: 12, margin: '6px 0', opacity: 0.85 }}>
          <p style={{ fontSize: 13, lineHeight: 1.65, fontStyle: 'italic', color: textClr }}>
            {renderInline(t.slice(2), k)}
          </p>
        </div>
      )
      i++; continue
    }

    // Regular paragraph
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('• ') &&
      !(lines[i].trim().startsWith('* ') && !lines[i].trim().startsWith('**')) &&
      !/^\d+[\.\)]\s/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('> ') &&
      lines[i].trim() !== '---'
    ) {
      para.push(lines[i])
      i++
    }
    if (para.length > 0) {
      blocks.push(
        <p key={k++} style={{ fontSize: 13.5, lineHeight: 1.7, margin: '2px 0', color: textClr }}>
          {renderInline(para.join(' '), k)}
        </p>
      )
    }
  }

  return <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>{blocks}</div>
}

// =============================================
// CHAT COMPONENT
// =============================================
function ChatContent() {
  const params = useSearchParams()
  const { markAsRead, unreadByConversation } = useNotifications()
  const [user, setUser] = useState<any>(null)
  const [convs, setConvs] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  const [msgs, setMsgs] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [showAI, setShowAI] = useState(false)
  // ── "Yozyapti..." indikator ──
  const [otherTyping, setOtherTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const myTypingChannelRef = useRef<any>(null)
  const lastTypingSentRef = useRef<number>(0)
  // ── Qidiruv va filter ──
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all')
  const [tabCounts, setTabCounts] = useState({ all: 0, unread: 0, archived: 0 })
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null)
  const [archivingId, setArchivingId] = useState<string | null>(null)

  // AI welcome xabari
  const WELCOME_MSG = { role: 'ai' as const, content: "Assalomu alaykum! 👋\n\nMen **YuristimAI 0.1 beta** — O'zbekiston huquqshunos AI konsultantiman.\n\nSavolingizni yozing, men sizga aniq qonun moddalari va rasmiy manbalar bilan javob beraman. Bilmagan masalada to'g'ridan-to'g'ri ayitb beraman.\n\nQanday yordam kerak?" }

  const [aiMsgs, setAiMsgs] = useState<{ role: 'user' | 'ai'; content: string }[]>([WELCOME_MSG])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const aiEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const aiInputRef = useRef<HTMLInputElement>(null)

  // localStorage dan AI suhbat tarixini yuklash
  useEffect(() => {
    try {
      const saved = localStorage.getItem('yuristim_ai_history')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAiMsgs(parsed)
        }
      }
    } catch {}
  }, [])

  // AI suhbatni localStorage ga saqlash (har o'zgarishda)
  useEffect(() => {
    if (aiMsgs.length > 1) {  // welcome dan boshqa xabar bo'lsa
      try {
        localStorage.setItem('yuristim_ai_history', JSON.stringify(aiMsgs))
      } catch {}
    }
  }, [aiMsgs])

  // Yangi suhbat boshlash
  const startNewAiChat = () => {
    if (confirm("Yangi suhbat boshlamoqchimisiz? Joriy suhbat tarixingiz o'chiriladi.")) {
      setAiMsgs([WELCOME_MSG])
      try { localStorage.removeItem('yuristim_ai_history') } catch {}
    }
  }

  // Suhbatlarni yuklash (filter va search bilan)
  const loadConversations = async (uid: string, currentFilter = filter, currentSearch = searchQuery) => {
    const [{ data: list }, { data: counts }] = await Promise.all([
      supabase.rpc('get_user_conversations', {
        p_user_id: uid,
        p_filter: currentFilter,
        p_search: currentSearch || null,
      }),
      supabase.rpc('get_conversation_tab_counts', { p_user_id: uid }),
    ])
    setConvs(list || [])
    if (counts?.[0]) {
      setTabCounts({
        all: Number(counts[0].all_count),
        unread: Number(counts[0].unread_count),
        archived: Number(counts[0].archived_count),
      })
    }
  }

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(async d => {
      setUser(d.user)
      if (d.user) {
        await loadConversations(d.user.id, 'all', '')
      }
    })
  }, [])

  // Filter o'zgarsa qayta yuklash
  useEffect(() => {
    if (user?.id) loadConversations(user.id, filter, searchQuery)
  }, [filter])

  // Search debounce
  useEffect(() => {
    if (!user?.id) return
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      setSearchQuery(searchInput)
      loadConversations(user.id, filter, searchInput)
    }, 350)
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [searchInput])

  // Arxivlash/qaytarish
  const toggleArchive = async (conv: any, archive: boolean) => {
    if (!user?.id) return
    setArchivingId(conv.id)
    await supabase.rpc('toggle_conversation_archive', {
      p_user_id: user.id,
      p_conversation_id: conv.id,
      p_archive: archive,
    })
    await loadConversations(user.id, filter, searchQuery)
    setArchivingId(null)
  }

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [aiMsgs])

  const openConv = async (c: any) => {
    setActive(c); setShowAI(false)
    const { data } = await supabase
      .from('messages').select('*').eq('conversation_id', c.id)
      .order('created_at', { ascending: true }).limit(60)
    setMsgs(data || [])
    // Xabarlarni o'qildi deb belgilash
    if (c.id) {
      await markAsRead(c.id)
    }
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  // 🔴 REAL-TIME: yangi xabarlarni va o'qildi statusini kuzatish
  useEffect(() => {
    if (!active?.id) return

    const channel = supabase
      .channel(`messages:${active.id}`)
      // Yangi xabar kelganda
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${active.id}`,
        },
        (payload: any) => {
          const newMsg = payload.new
          setMsgs(prev => {
            if (prev.some(m => m.id === newMsg.id)) return prev
            const tempIdx = prev.findIndex(m => m.sender_id === newMsg.sender_id && m.content === newMsg.content && typeof m.id === 'number')
            if (tempIdx !== -1) {
              const copy = [...prev]
              copy[tempIdx] = newMsg
              return copy
            }
            return [...prev, newMsg]
          })
        }
      )
      // Xabar o'qilgani yangilanganda (✓✓ ko'k)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${active.id}`,
        },
        (payload: any) => {
          const updated = payload.new
          setMsgs(prev => prev.map(m =>
            m.id === updated.id
              ? { ...m, is_read: updated.is_read, read_at: updated.read_at }
              : m
          ))
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [active?.id])

  // ──────────────────────────────────────────
  // YOZYAPTI INDIKATORI — Realtime broadcast
  // (DB'ga yozmasdan, faqat connect bo'lganlarga)
  // ──────────────────────────────────────────
  useEffect(() => {
    if (!active?.id || !user?.id) return

    setOtherTyping(false)
    const channel = supabase.channel(`typing:${active.id}`, {
      config: { broadcast: { self: false } },
    })

    channel
      .on('broadcast', { event: 'typing' }, (payload: any) => {
        // Boshqa foydalanuvchi yozyapti
        if (payload.payload.userId !== user.id) {
          setOtherTyping(true)
          // 3 sekund passive bo'lsa o'chiramiz (eski timeout'ni tozalash)
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
          typingTimeoutRef.current = setTimeout(() => setOtherTyping(false), 3000)
        }
      })
      .on('broadcast', { event: 'stopped_typing' }, (payload: any) => {
        if (payload.payload.userId !== user.id) {
          setOtherTyping(false)
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        }
      })
      .subscribe()

    myTypingChannelRef.current = channel

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      supabase.removeChannel(channel)
      myTypingChannelRef.current = null
    }
  }, [active?.id, user?.id])

  // Foydalanuvchi yozayotganini broadcast qilish (throttle 2 sek)
  const broadcastTyping = () => {
    if (!myTypingChannelRef.current || !user?.id) return
    const now = Date.now()
    // Har 2 sekundda 1 marta yuborish
    if (now - lastTypingSentRef.current < 2000) return
    lastTypingSentRef.current = now
    myTypingChannelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: user.id },
    })
  }

  // Yozishni to'xtatdi - darhol "stopped_typing" yuborish (xabar yuborilganda)
  const broadcastStoppedTyping = () => {
    if (!myTypingChannelRef.current || !user?.id) return
    lastTypingSentRef.current = 0
    myTypingChannelRef.current.send({
      type: 'broadcast',
      event: 'stopped_typing',
      payload: { userId: user.id },
    })
  }

  // 🔴 REAL-TIME: conversations ro'yxati uchun (yangi xabar kelsa list yangilanadi)
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase
      .channel(`user-convs:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        async () => {
          // Conversations ro'yxatini qayta yuklash (joriy filter va search bilan)
          await loadConversations(user.id, filter, searchQuery)
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user?.id])

  const sendMsg = async () => {
    if (!input.trim() || !active || !user) return
    setSending(true)
    const text = input.trim(); setInput('')
    // Yozishni to'xtatdik — darhol indikatorni o'chirish
    broadcastStoppedTyping()
    // Optimistic update — darhol ko'rsatamiz, keyin realtime real xabarni qo'yadi
    setMsgs(prev => [...prev, { id: Date.now(), sender_id: user.id, content: text, created_at: new Date().toISOString() }])
    await supabase.rpc('send_message', { p_conversation_id: active.id, p_sender_id: user.id, p_content: text })

    // Push notification qabul qiluvchiga (chatdan tashqaridaligi mumkin)
    // Fire-and-forget: kutmaymiz, xato bo'lsa ham xabar ketgan
    fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: active.other_id,
        title: user.full_name || user.username || 'Yangi xabar',
        body: text.length > 100 ? text.slice(0, 100) + '...' : text,
        url: `/dashboard/chat?conv=${active.id}`,
        tag: `conv-${active.id}`,
      }),
    }).catch(() => {}) // xato bo'lsa ham asosiy oqim to'xtamasin

    setSending(false)
  }

  const sendAI = async () => {
    if (!aiInput.trim() || aiLoading) return
    const q = aiInput.trim(); setAiInput('')
    const newUserMsg = { role: 'user' as const, content: q }
    const updatedMsgs = [...aiMsgs, newUserMsg]
    setAiMsgs(updatedMsgs)
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Welcome xabarini chiqarib, oxirgi 10 ta xabarni yuboramiz
        body: JSON.stringify({
          messages: updatedMsgs.slice(updatedMsgs.length === 1 ? 0 : 1)
        })
      })
      const d = await res.json()
      setAiMsgs(prev => [...prev, { role: 'ai', content: d.reply || 'Javob topilmadi.' }])
    } catch {
      setAiMsgs(prev => [...prev, { role: 'ai', content: 'Tarmoq xatosi. Qayta urinib ko\'ring.' }])
    }
    setAiLoading(false)
    setTimeout(() => aiInputRef.current?.focus(), 100)
  }

  const ini = (n: string) => n?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const fmtTime = (iso: string) => iso ? new Date(iso).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : ''

  // Yozyapti dot stili (animation delay bilan, ixtiyoriy rang)
  const typingDotStyle = (delay: number, color: string = '#94a3b8'): React.CSSProperties => ({
    width: 7, height: 7,
    background: color,
    borderRadius: '50%',
    display: 'inline-block',
    animation: `typingBounce 1.2s infinite ease-in-out`,
    animationDelay: `${delay}s`,
  })

  // AI Chat
  if (showAI) return (
    <div style={{ maxWidth: 760, margin: '0 auto', height: 'calc(100vh - 144px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '0.5px solid #f1f5f9', flexShrink: 0 }}>
        <button onClick={() => setShowAI(false)} style={{ width: 34, height: 34, background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={15} color="#475569" />
        </button>
        <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Bot size={21} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>YuristimAI</span>
            <span style={{ fontSize: 9, fontWeight: 700, background: 'linear-gradient(135deg,#7c3aed,#4338ca)', color: '#fff', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.3px' }}>0.1 BETA</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <div style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%' }} />
            <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 500 }}>Onlayn · Rasmiy manbalar bilan</span>
          </div>
        </div>
        {/* Yangi suhbat tugmasi */}
        {aiMsgs.length > 1 && (
          <button onClick={startNewAiChat}
            title="Yangi suhbat"
            style={{ width: 34, height: 34, background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Plus size={16} color="#475569" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {aiMsgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end' }}>
            {m.role === 'ai' && (
              <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 2 }}>
                <Bot size={15} color="#fff" />
              </div>
            )}
            <div style={{
              maxWidth: '78%',
              padding: '11px 15px',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? '#0f172a' : '#fff',
              border: m.role === 'ai' ? '0.5px solid #e2e8f0' : 'none',
              boxShadow: m.role === 'ai' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
            }}>
              <MarkdownMessage content={m.content} isAI={m.role === 'ai'} />
            </div>
          </div>
        ))}

        {/* Loading dots */}
        {aiLoading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={15} color="#fff" />
            </div>
            <div style={{ padding: '12px 16px', background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 5, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: '#cbd5e1', animation: `bounce 1.2s ${j * 0.2}s infinite ease-in-out` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={aiEndRef} />
      </div>

      {/* Kuchaytirilgan Disclaimer Banner */}
      <div style={{
        background: '#fff7ed',
        border: '1px solid #fed7aa',
        borderRadius: 12,
        padding: '10px 14px',
        margin: '10px 0 12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        flexShrink: 0,
      }}>
        <div style={{ width: 26, height: 26, background: '#fed7aa', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
          <AlertTriangle size={14} color="#c2410c" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#9a3412', marginBottom: 2 }}>
            YuristimAI 0.1 beta — sinov rejimida
          </p>
          <p style={{ fontSize: 11, color: '#c2410c', lineHeight: 1.5 }}>
            AI xato qilishi mumkin. Aniq huquqiy maslahat uchun yurist bilan bog'laning.{' '}
            <Link href="/#fazalar" style={{ color: '#9a3412', fontWeight: 600, textDecoration: 'underline' }}>
              Keyingi fazada batafsil →
            </Link>
          </p>
        </div>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 10, paddingTop: 0, flexShrink: 0 }}>
        <input
          ref={aiInputRef}
          value={aiInput}
          onChange={e => setAiInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendAI()}
          style={{ flex: 1, padding: '12px 16px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 150ms' }}
          onFocus={e => (e.target as HTMLElement).style.borderColor = '#7c3aed'}
          onBlur={e => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
          placeholder="Huquqiy savolingizni yozing..."
          disabled={aiLoading}
        />
        <button onClick={sendAI} disabled={aiLoading || !aiInput.trim()}
          style={{ width: 46, height: 46, background: (!aiInput.trim() || aiLoading) ? '#f1f5f9' : 'linear-gradient(135deg,#7c3aed,#4338ca)', border: 'none', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 200ms', flexShrink: 0 }}>
          <Send size={17} color={(!aiInput.trim() || aiLoading) ? '#94a3b8' : '#fff'} />
        </button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}`}</style>
    </div>
  )

  // Active conversation
  if (active) return (
    <div style={{ maxWidth: 760, margin: '0 auto', height: 'calc(100vh - 144px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '0.5px solid #f1f5f9', flexShrink: 0 }}>
        <button onClick={() => setActive(null)} style={{ width: 34, height: 34, background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={15} color="#475569" />
        </button>
        <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#334155,#475569)', color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
          {ini(active.other_name)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{active.other_name}</span>
            {active.other_verified && <BadgeCheck size={14} color="#3b82f6" />}
          </div>
          {otherTyping ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600, fontStyle: 'italic' }}>
                yozyapti
              </span>
              <span style={{ ...typingDotStyle(0, '#3b82f6'), width: 5, height: 5 }} />
              <span style={{ ...typingDotStyle(0.2, '#3b82f6'), width: 5, height: 5 }} />
              <span style={{ ...typingDotStyle(0.4, '#3b82f6'), width: 5, height: 5 }} />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>@{active.other_username}</span>
              {active.other_role === 'lawyer' && parseFloat(active.other_rating) > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>
                  <Star size={9} fill="#f59e0b" color="#f59e0b" /> {parseFloat(active.other_rating).toFixed(1)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>Suhbatni boshlang...</div>
        )}
        {msgs.map(m => {
          const mine = m.sender_id === user?.id
          const isTemp = typeof m.id === 'number'  // hali server javob bermagan
          const isRead = m.is_read === true
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', alignItems: 'flex-end' }}>
              <div style={{ maxWidth: '72%' }}>
                <div style={{ padding: '10px 14px', fontSize: 13.5, lineHeight: 1.65, borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: mine ? '#0f172a' : '#f1f5f9', color: mine ? '#fff' : '#1e293b' }}>
                  {m.content}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{fmtTime(m.created_at)}</span>
                  {mine && (
                    isTemp ? (
                      // Vaqtinchalik xabar - hali yuborilmagan
                      <Loader2 size={10} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : isRead ? (
                      // O'qildi - ko'k ✓✓
                      <CheckCheck size={12} color="#3b82f6" strokeWidth={2.5} />
                    ) : (
                      // Yuborildi - kulrang ✓✓
                      <CheckCheck size={11} color="#94a3b8" />
                    )
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Yozyapti indikator */}
        {otherTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
            <div style={{
              padding: '12px 16px',
              background: '#f1f5f9',
              borderRadius: '18px 18px 18px 4px',
              display: 'inline-flex', alignItems: 'center', gap: 4,
              animation: 'fadeIn 0.2s ease',
            }}>
              <span className="typing-dot" style={typingDotStyle(0)} />
              <span className="typing-dot" style={typingDotStyle(0.2)} />
              <span className="typing-dot" style={typingDotStyle(0.4)} />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: 10, borderTop: '0.5px solid #f1f5f9', paddingTop: 12, flexShrink: 0 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => {
            setInput(e.target.value)
            // Boshqa foydalanuvchiga "yozyapti" signal yuborish
            if (e.target.value.length > 0) broadcastTyping()
          }}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
          style={{ flex: 1, padding: '12px 16px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 150ms' }}
          onFocus={e => (e.target as HTMLElement).style.borderColor = '#6366f1'}
          onBlur={e => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
          placeholder="Xabar yozing..."
        />
        <button onClick={sendMsg} disabled={!input.trim()}
          style={{ width: 46, height: 46, background: !input.trim() ? '#f1f5f9' : '#0f172a', border: 'none', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms', flexShrink: 0 }}>
          <Send size={17} color={!input.trim() ? '#94a3b8' : '#fff'} />
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )

  // Conversations list
  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', marginBottom: 20 }}>Suhbatlar</h1>

      {/* AI chatbot card */}
      <div
        onClick={() => setShowAI(true)}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: 'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius: 18, cursor: 'pointer', marginBottom: 16, transition: 'transform 200ms', position: 'relative', overflow: 'hidden' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, background: 'rgba(99,102,241,0.2)', borderRadius: '50%' }} />
        <div style={{ width: 46, height: 46, background: 'rgba(255,255,255,0.12)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={22} color="#a5b4fc" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>YuristimAI</span>
            <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.3px' }}>0.1 BETA</span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>Rasmiy manbalar va aniq qonun moddalari bilan</p>
        </div>
        <div style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', flexShrink: 0 }} />
      </div>

      {/* ════════════════════════════════════ */}
      {/* QIDIRUV BAR                          */}
      {/* ════════════════════════════════════ */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Ism, username yoki xabar bo'yicha qidiring..."
          style={{
            width: '100%',
            padding: '11px 16px 11px 40px',
            fontSize: 13.5,
            background: '#fff',
            border: '0.5px solid #e2e8f0',
            borderRadius: 12,
            outline: 'none',
            fontFamily: 'inherit',
            color: '#0f172a',
            boxSizing: 'border-box' as const,
          }}
          onFocus={e => (e.target as HTMLElement).style.borderColor = '#0f172a'}
          onBlur={e => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              width: 22, height: 22, background: '#f1f5f9', border: 'none',
              borderRadius: 6, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <X size={12} color="#64748b" />
          </button>
        )}
      </div>

      {/* ════════════════════════════════════ */}
      {/* TAB'LAR                              */}
      {/* ════════════════════════════════════ */}
      <div style={{
        display: 'flex', gap: 6,
        background: '#f1f5f9', padding: 4, borderRadius: 11,
        marginBottom: 14,
      }}>
        {([
          { key: 'all', label: 'Hammasi', count: tabCounts.all, icon: MessageCircle },
          { key: 'unread', label: "O'qilmagan", count: tabCounts.unread, icon: Bell },
          { key: 'archived', label: 'Arxiv', count: tabCounts.archived, icon: Archive },
        ] as const).map(tab => {
          const isActive = filter === tab.key
          const TabIcon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '8px 10px',
                background: isActive ? '#fff' : 'transparent',
                border: 'none',
                borderRadius: 8,
                fontSize: 12, fontWeight: 700,
                color: isActive ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 150ms',
              }}>
              <TabIcon size={12} color={isActive ? '#0f172a' : '#94a3b8'} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span style={{
                  background: isActive ? '#0f172a' : '#cbd5e1',
                  color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  padding: '1px 6px', borderRadius: 100,
                  minWidth: 18, textAlign: 'center',
                  lineHeight: 1.4,
                }}>
                  {tab.count > 99 ? '99+' : tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* User conversations */}
      {convs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fafafa', borderRadius: 18, border: '0.5px solid #f1f5f9' }}>
          {filter === 'archived' ? (
            <>
              <Archive size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Arxiv bo'sh</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Arxivlangan suhbatlar shu yerda ko'rinadi</p>
            </>
          ) : filter === 'unread' ? (
            <>
              <CheckCheck size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Hammasi o'qilgan</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>O'qilmagan xabarlar yo'q</p>
            </>
          ) : searchQuery ? (
            <>
              <Search size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Hech narsa topilmadi</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>"{searchQuery}" bo'yicha natija yo'q</p>
            </>
          ) : (
            <>
              <MessageCircle size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Suhbatlar yo'q</p>
              <p style={{ fontSize: 12, color: '#94a3b8' }}>E'lonlar sahifasidan yurist bilan bog'laning</p>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {convs.map(c => {
            // Real-time unread count (NotificationContext'dan)
            const liveUnread = unreadByConversation.get(c.id) || 0
            const dbUnread = parseInt(c.unread_count) || 0
            const unreadCount = Math.max(liveUnread, dbUnread)
            const isActive = active?.id === c.id

            return (
            <div key={c.id} onClick={() => openConv(c)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                background: isActive ? '#fafafa' : '#fff',
                border: isActive ? '0.5px solid #0f172a' : '0.5px solid #e2e8f0',
                borderRadius: 14, cursor: 'pointer', transition: 'all 200ms',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0f172a'; el.style.background = '#fafafa' } }}
              onMouseLeave={e => { if (!isActive) { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e2e8f0'; el.style.background = '#fff' } }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#334155,#475569)', color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {ini(c.other_name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: unreadCount > 0 ? 800 : 700, color: '#0f172a' }}>{c.other_name}</span>
                  {c.other_verified && <BadgeCheck size={13} color="#3b82f6" />}
                </div>
                <p style={{
                  fontSize: 12,
                  color: unreadCount > 0 ? '#0f172a' : '#94a3b8',
                  fontWeight: unreadCount > 0 ? 600 : 400,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {c.last_message || 'Suhbat boshlang...'}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                {c.last_message_at && <span style={{ fontSize: 10, color: '#94a3b8' }}>{fmtTime(c.last_message_at)}</span>}
                {unreadCount > 0 && (
                  <div style={{
                    minWidth: 20, height: 20, background: '#ef4444', borderRadius: 100,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10.5, fontWeight: 700, color: '#fff', padding: '0 6px',
                    boxShadow: '0 2px 6px rgba(239,68,68,0.3)',
                  }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </div>
                )}
              </div>

              {/* Arxiv/qaytarish tugmasi */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleArchive(c, !c.is_archived)
                }}
                disabled={archivingId === c.id}
                style={{
                  width: 32, height: 32,
                  background: c.is_archived ? '#dbeafe' : '#f1f5f9',
                  border: 'none', borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: archivingId === c.id ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                  marginLeft: 4,
                  transition: 'all 150ms',
                  opacity: archivingId === c.id ? 0.5 : 1,
                }}
                title={c.is_archived ? "Arxivdan qaytarish" : "Arxivlash"}>
                {archivingId === c.id ? (
                  <Loader2 size={13} color="#64748b" style={{ animation: 'spin 1s linear infinite' }} />
                ) : c.is_archived ? (
                  <ArchiveRestore size={13} color="#1d4ed8" />
                ) : (
                  <Archive size={13} color="#64748b" />
                )}
              </button>
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <Loader2 size={24} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
