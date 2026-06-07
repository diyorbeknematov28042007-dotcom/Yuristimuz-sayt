'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Bot, Send, MessageCircle, BadgeCheck, Star, ArrowLeft, Loader2 } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ChatPage() {
  const params = useSearchParams()
  const targetUserId = params.get('user')

  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [activeConv, setActiveConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Salom! Men Yuristim AI yordamchisiman. Huquqiy savollarga javob beraman. Eslatma: Men xato qilishim mumkin — muhim masalalarda haqiqiy yurist bilan maslahatlashing. 🏛️" }
  ])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      setUser(data.user)
      if (data.user) await fetchConversations(data.user.id)
    }
    init()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages])

  const fetchConversations = async (userId: string) => {
    const { data } = await supabase.rpc('get_user_conversations', { p_user_id: userId })
    setConversations(data || [])
  }

  const openConversation = async (conv: any) => {
    setActiveConv(conv)
    setShowAI(false)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: true })
      .limit(50)
    setMessages(data || [])
  }

  const sendMessage = async () => {
    if (!input.trim() || !activeConv || !user) return
    setSending(true)
    const content = input.trim()
    setInput('')
    setMessages(prev => [...prev, { id: Date.now(), sender_id: user.id, content, created_at: new Date().toISOString() }])
    await supabase.rpc('send_message', { p_conversation_id: activeConv.id, p_sender_id: user.id, p_content: content })
    setSending(false)
  }

  const sendAiMessage = async () => {
    if (!aiInput.trim() || aiLoading) return
    const question = aiInput.trim()
    setAiInput('')
    setAiMessages(prev => [...prev, { role: 'user', content: question }])
    setAiLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question })
      })
      const data = await res.json()
      setAiMessages(prev => [...prev, { role: 'ai', content: data.reply || "Kechirasiz, xatolik yuz berdi." }])
    } catch {
      setAiMessages(prev => [...prev, { role: 'ai', content: "Tarmoq xatosi. Qayta urinib ko'ring." }])
    }
    setAiLoading(false)
  }

  const initials = (name: string) => name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  // Chat oynasi ochiq bo'lsa — to'liq ekran chat
  if (showAI) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', borderBottom: '0.5px solid #e2e8f0', marginBottom: 0 }}>
          <button onClick={() => setShowAI(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
            <ArrowLeft size={18} />
          </button>
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Bot size={19} color="#fff" />
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>AI Huquqiy Konsultant</p>
            <p style={{ fontSize: 11, color: '#22c55e', fontWeight: 500 }}>● Onlayn</p>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {aiMessages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'ai' && (
                <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Bot size={15} color="#fff" />
                </div>
              )}
              <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: msg.role === 'user' ? '#0f172a' : '#f8fafc', color: msg.role === 'user' ? '#fff' : '#0f172a', fontSize: 13, lineHeight: 1.6, border: msg.role === 'ai' ? '0.5px solid #e2e8f0' : 'none' }}>
                {msg.content}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={15} color="#fff" />
              </div>
              <div style={{ padding: '12px 16px', background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: '14px 14px 14px 4px', display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={aiEndRef} />
        </div>

        <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', padding: '8px 0', borderTop: '0.5px solid #f1f5f9' }}>
          ⚠️ Sun'iy intellekt xato qilishi mumkin. Muhim masalalarda yurist bilan bog'laning.
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 10, padding: '12px 0' }}>
          <input
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendAiMessage()}
            style={{ flex: 1, padding: '11px 16px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#0f172a', outline: 'none', fontFamily: 'inherit' }}
            placeholder="Huquqiy savol yozing..."
          />
          <button onClick={sendAiMessage} disabled={aiLoading || !aiInput.trim()}
            style={{ width: 44, height: 44, background: '#0f172a', border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: aiLoading || !aiInput.trim() ? 0.5 : 1 }}>
            <Send size={17} color="#fff" />
          </button>
        </div>

        <style>{`@keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }`}</style>
      </div>
    )
  }

  if (activeConv) {
    return (
      <div style={{ maxWidth: 800, margin: '0 auto', height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0', borderBottom: '0.5px solid #e2e8f0' }}>
          <button onClick={() => setActiveConv(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
            <ArrowLeft size={18} />
          </button>
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
            {initials(activeConv.other_name)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>{activeConv.other_name}</span>
              {activeConv.other_verified && <BadgeCheck size={13} color="#3b82f6" />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>@{activeConv.other_username}</span>
              {activeConv.other_role === 'lawyer' && activeConv.other_rating > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, color: '#f59e0b' }}>
                  <Star size={10} fill="#f59e0b" /> {parseFloat(activeConv.other_rating).toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: 32, color: '#94a3b8', fontSize: 13 }}>
              Suhbatni boshlang...
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender_id === user?.id ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '70%', padding: '9px 14px', borderRadius: msg.sender_id === user?.id ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: msg.sender_id === user?.id ? '#0f172a' : '#f1f5f9', color: msg.sender_id === user?.id ? '#fff' : '#0f172a', fontSize: 13, lineHeight: 1.6 }}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ display: 'flex', gap: 10, padding: '12px 0', borderTop: '0.5px solid #f1f5f9' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            style={{ flex: 1, padding: '11px 16px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, outline: 'none', fontFamily: 'inherit' }}
            placeholder="Xabar yozing..."
          />
          <button onClick={sendMessage} disabled={sending || !input.trim()}
            style={{ width: 44, height: 44, background: '#0f172a', border: 'none', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: !input.trim() ? 0.5 : 1 }}>
            <Send size={17} color="#fff" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', marginBottom: 20 }}>Suhbatlar</h1>

      {/* AI Konsultant — DOIM birinchi */}
      <div onClick={() => setShowAI(true)}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'linear-gradient(135deg,#faf5ff,#ede9fe)', border: '1px solid #c4b5fd', borderRadius: 14, cursor: 'pointer', marginBottom: 16, transition: 'all 200ms' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#7c3aed'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#c4b5fd'}>
        <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Bot size={22} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>AI Huquqiy Konsultant</span>
            <span style={{ fontSize: 9, fontWeight: 700, background: '#7c3aed', color: '#fff', padding: '2px 7px', borderRadius: 4, letterSpacing: '0.5px' }}>AI</span>
          </div>
          <p style={{ fontSize: 12, color: '#6d28d9' }}>Huquqiy savollarga darhol javob — bepul</p>
        </div>
        <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', flexShrink: 0 }} />
      </div>

      {/* Suhbatlar */}
      {conversations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fafafa', borderRadius: 16, border: '0.5px solid #e2e8f0' }}>
          <MessageCircle size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Suhbatlar yo'q</p>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>E'lonlar orqali yurist yoki mijoz bilan bog'laning</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {conversations.map(conv => (
            <div key={conv.id} onClick={() => openConversation(conv)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, cursor: 'pointer', transition: 'all 200ms' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#0f172a'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'}>
              <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {initials(conv.other_name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{conv.other_name}</span>
                  {conv.other_verified && <BadgeCheck size={12} color="#3b82f6" />}
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.last_message || "Suhbat boshlang..."}
                </p>
              </div>
              {conv.unread_count > 0 && (
                <div style={{ width: 20, height: 20, background: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {conv.unread_count}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
