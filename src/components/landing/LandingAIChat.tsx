// ════════════════════════════════════════════════
// Landing AI chat preview — haqiqiy chatga MOS
// /src/components/landing/LandingAIChat.tsx
// Savol → AI "ro'yxatdan o'ting" deydi → savol localStorage'da saqlanadi
// ════════════════════════════════════════════════

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Send, Sparkles } from 'lucide-react'

export default function LandingAIChat() {
  const [msgs, setMsgs] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "Assalomu alaykum! Men YuristimAI — O'zbekiston huquqshunos AI konsultantiman. Huquqiy savolingizni yozing." },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCTA, setShowCTA] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading, showCTA])

  const send = () => {
    const q = input.trim()
    if (!q || loading) return

    // User savolini ko'rsatamiz
    setMsgs(prev => [...prev, { role: 'user', content: q }])
    setInput('')
    setLoading(true)

    // Savolni brauzerda saqlaymiz — ro'yxatdan keyin chatga ko'chadi
    try { localStorage.setItem('yuristim_pending_question', q) } catch {}

    // AI "yozmoqda" → javob (haqiqiy javob bermaydi)
    setTimeout(() => {
      setLoading(false)
      setMsgs(prev => [...prev, {
        role: 'ai',
        content: "Savolingizni tushundim. Unga to'liq javob berishim uchun ro'yxatdan o'ting — sizni chatlar bo'limida kutaman. Savolingiz saqlanib qoldi, hisobingizga kirgach darhol javob beraman.",
      }])
      setTimeout(() => setShowCTA(true), 400)
    }, 1100)
  }

  return (
    <div style={{
      maxWidth: 620, margin: '0 auto',
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20,
      overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
    }}>
      {/* Header — haqiqiy chatdagidek */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderBottom: '0.5px solid #f1f5f9' }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(67,56,202,0.2)' }}>
          <img src="/icon-512.png" alt="YuristimAI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
      </div>

      {/* Messages */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 220, maxHeight: 360, overflowY: 'auto', background: '#fafafa' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end' }}>
            {m.role === 'ai' && (
              <div style={{ width: 30, height: 30, borderRadius: 9, overflow: 'hidden', flexShrink: 0, marginBottom: 2 }}>
                <img src="/icon-512.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{
              maxWidth: '78%',
              padding: '11px 15px',
              borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: m.role === 'user' ? '#0f172a' : '#fff',
              color: m.role === 'user' ? '#fff' : '#0f172a',
              border: m.role === 'ai' ? '0.5px solid #e2e8f0' : 'none',
              boxShadow: m.role === 'ai' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
              fontSize: 13.5, lineHeight: 1.5,
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {/* Loading dots — haqiqiy chatdagidek */}
        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, overflow: 'hidden', flexShrink: 0 }}>
              <img src="/icon-512.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '12px 16px', background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: '18px 18px 18px 4px', display: 'flex', gap: 5, alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: '#cbd5e1', animation: `landingBounce 1.2s ${j * 0.2}s infinite ease-in-out` }} />
              ))}
            </div>
          </div>
        )}

        {/* CTA — ro'yxatdan o'tish */}
        {showCTA && (
          <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 14, background: 'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius: 13,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(67,56,202,0.25)',
            }}>
              <Sparkles size={16} color="#fff" />
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 13.5 }}>Ro'yxatdan o'tish → AI javob beradi</span>
            </div>
          </Link>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '14px 18px', background: '#fff', borderTop: '0.5px solid #e2e8f0', display: 'flex', gap: 9 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') send() }}
          placeholder="Masalan: Ishdan noqonuniy bo'shatishdi, nima qilay?"
          disabled={showCTA}
          style={{
            flex: 1, padding: '11px 15px', border: '1px solid #e2e8f0', borderRadius: 12,
            fontSize: 13.5, fontFamily: 'inherit', outline: 'none',
            background: showCTA ? '#f8fafc' : '#fff',
          }}
        />
        <button
          onClick={send}
          disabled={loading || showCTA || !input.trim()}
          style={{
            padding: '0 16px', background: input.trim() && !showCTA ? '#0f172a' : '#cbd5e1', color: '#fff',
            border: 'none', borderRadius: 12, cursor: input.trim() && !showCTA ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
          <Send size={17} />
        </button>
      </div>

      <style>{`
        @keyframes landingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
