'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Bot, Send, ArrowLeft, BadgeCheck, Star, Sparkles, CheckCheck, Loader2, Plus, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

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
  const [user, setUser] = useState<any>(null)
  const [convs, setConvs] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  const [msgs, setMsgs] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [showAI, setShowAI] = useState(false)

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

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(async d => {
      setUser(d.user)
      if (d.user) {
        const { data } = await supabase.rpc('get_user_conversations', { p_user_id: d.user.id })
        setConvs(data || [])
      }
    })
  }, [])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [aiMsgs])

  const openConv = async (c: any) => {
    setActive(c); setShowAI(false)
    const { data } = await supabase
      .from('messages').select('*').eq('conversation_id', c.id)
      .order('created_at', { ascending: true }).limit(60)
    setMsgs(data || [])
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  // 🔴 REAL-TIME: yangi xabarlarni avtomatik kuzatish
  useEffect(() => {
    if (!active?.id) return

    const channel = supabase
      .channel(`messages:${active.id}`)
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
          // O'zim yuborgan xabar bo'lsa qo'shma (allaqachon optimistic update qildim)
          setMsgs(prev => {
            // Duplikatni oldini olish
            if (prev.some(m => m.id === newMsg.id)) return prev
            // O'zim yuborgan bo'lsa temporary message ni real bilan almashtirish
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
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [active?.id])

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
          // Conversations ro'yxatini qayta yuklash
          const { data } = await supabase.rpc('get_user_conversations', { p_user_id: user.id })
          setConvs(data || [])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user?.id])

  const sendMsg = async () => {
    if (!input.trim() || !active || !user) return
    setSending(true)
    const text = input.trim(); setInput('')
    // Optimistic update — darhol ko'rsatamiz, keyin realtime real xabarni qo'yadi
    setMsgs(prev => [...prev, { id: Date.now(), sender_id: user.id, content: text, created_at: new Date().toISOString() }])
    await supabase.rpc('send_message', { p_conversation_id: active.id, p_sender_id: user.id, p_content: text })
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>@{active.other_username}</span>
            {active.other_role === 'lawyer' && parseFloat(active.other_rating) > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>
                <Star size={9} fill="#f59e0b" color="#f59e0b" /> {parseFloat(active.other_rating).toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>Suhbatni boshlang...</div>
        )}
        {msgs.map(m => {
          const mine = m.sender_id === user?.id
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', alignItems: 'flex-end' }}>
              <div style={{ maxWidth: '72%' }}>
                <div style={{ padding: '10px 14px', fontSize: 13.5, lineHeight: 1.65, borderRadius: mine ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: mine ? '#0f172a' : '#f1f5f9', color: mine ? '#fff' : '#1e293b' }}>
                  {m.content}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{fmtTime(m.created_at)}</span>
                  {mine && <CheckCheck size={11} color="#94a3b8" />}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: 10, borderTop: '0.5px solid #f1f5f9', paddingTop: 12, flexShrink: 0 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
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

      {/* User conversations */}
      {convs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fafafa', borderRadius: 18, border: '0.5px solid #f1f5f9' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Suhbatlar yo'q</p>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>E'lonlar sahifasidan yurist bilan bog'laning</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {convs.map(c => (
            <div key={c.id} onClick={() => openConv(c)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, cursor: 'pointer', transition: 'all 200ms' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0f172a'; el.style.background = '#fafafa' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e2e8f0'; el.style.background = '#fff' }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#334155,#475569)', color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {ini(c.other_name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{c.other_name}</span>
                  {c.other_verified && <BadgeCheck size={13} color="#3b82f6" />}
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.last_message || 'Suhbat boshlang...'}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                {c.last_message_at && <span style={{ fontSize: 10, color: '#94a3b8' }}>{fmtTime(c.last_message_at)}</span>}
                {parseInt(c.unread_count) > 0 && (
                  <div style={{ minWidth: 18, height: 18, background: '#0f172a', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', padding: '0 5px' }}>
                    {c.unread_count}
                  </div>
                )}
              </div>
            </div>
          ))}
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
