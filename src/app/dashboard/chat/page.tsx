'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Bot, Send, ArrowLeft, BadgeCheck, Star, Loader2, Sparkles, CheckCheck, Clock } from 'lucide-react'

function ChatContent() {
  const params = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [convs, setConvs] = useState<any[]>([])
  const [active, setActive] = useState<any>(null)
  const [msgs, setMsgs] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [aiMsgs, setAiMsgs] = useState<{role:'user'|'ai', content:string}[]>([
    { role:'ai', content:"Assalomu alaykum! Men Yuristim AI konsultantiman. O'zbekiston qonunchiligi bo'yicha savollaringizga javob beraman.\n\nQanday yordam kerak? ⚖️" }
  ])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const aiEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(async d => {
      setUser(d.user)
      if (d.user) {
        const { data } = await supabase.rpc('get_user_conversations', { p_user_id: d.user.id })
        setConvs(data || [])
      }
    })
  }, [])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs])
  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior:'smooth' }) }, [aiMsgs])

  const openConv = async (c: any) => {
    setActive(c); setShowAI(false)
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', c.id).order('created_at', { ascending:true }).limit(60)
    setMsgs(data || [])
  }

  const sendMsg = async () => {
    if (!input.trim()||!active||!user) return
    setSending(true)
    const text = input.trim(); setInput('')
    setMsgs(prev => [...prev, { id: Date.now(), sender_id: user.id, content: text, created_at: new Date().toISOString() }])
    await supabase.rpc('send_message', { p_conversation_id: active.id, p_sender_id: user.id, p_content: text })
    setSending(false)
  }

  const sendAI = async () => {
    if (!aiInput.trim()||aiLoading) return
    const q = aiInput.trim(); setAiInput('')
    setAiMsgs(prev => [...prev, { role:'user', content:q }])
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message:q }) })
      const d = await res.json()
      setAiMsgs(prev => [...prev, { role:'ai', content: d.reply||"Javob topilmadi." }])
    } catch {
      setAiMsgs(prev => [...prev, { role:'ai', content: "Tarmoq xatosi. Qayta urinib ko'ring." }])
    }
    setAiLoading(false)
  }

  const ini = (n:string) => n?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()||'U'
  const fmtTime = (iso:string) => iso ? new Date(iso).toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit'}) : ''

  // AI Chat view
  if (showAI) return (
    <div style={{ maxWidth:760, margin:'0 auto', height:'calc(100vh - 144px)', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:14, borderBottom:'0.5px solid #f1f5f9', marginBottom:0 }}>
        <button onClick={()=>setShowAI(false)} style={{ width:34, height:34, background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <ArrowLeft size={15} color="#475569"/>
        </button>
        <div style={{ width:40, height:40, background:'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Bot size={20} color="#fff"/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <span style={{ fontWeight:700, color:'#0f172a', fontSize:15 }}>AI Huquqiy Konsultant</span>
            <span style={{ fontSize:9, fontWeight:700, background:'linear-gradient(135deg,#7c3aed,#4338ca)', color:'#fff', padding:'2px 7px', borderRadius:4 }}>AI</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:1 }}>
            <div style={{ width:6, height:6, background:'#22c55e', borderRadius:'50%' }} />
            <span style={{ fontSize:11, color:'#22c55e', fontWeight:500 }}>Onlayn · Darhol javob beradi</span>
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 0', display:'flex', flexDirection:'column', gap:14 }}>
        {aiMsgs.map((m,i) => (
          <div key={i} style={{ display:'flex', gap:10, justifyContent: m.role==='user'?'flex-end':'flex-start' }}>
            {m.role==='ai' && (
              <div style={{ width:32, height:32, background:'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                <Bot size={16} color="#fff"/>
              </div>
            )}
            <div style={{ maxWidth:'76%', padding:'11px 15px', fontSize:13.5, lineHeight:1.65,
              borderRadius: m.role==='user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role==='user' ? '#0f172a' : '#f8fafc',
              color: m.role==='user' ? '#fff' : '#1e293b',
              border: m.role==='ai' ? '0.5px solid #e2e8f0' : 'none',
              whiteSpace:'pre-wrap' }}>
              {m.content}
            </div>
          </div>
        ))}
        {aiLoading && (
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ width:32, height:32, background:'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Bot size={16} color="#fff"/>
            </div>
            <div style={{ padding:'11px 16px', background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:'16px 16px 16px 4px', display:'flex', gap:5, alignItems:'center' }}>
              {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'#cbd5e1', animation:`bounce 1.2s ${i*0.2}s infinite` }}/>)}
            </div>
          </div>
        )}
        <div ref={aiEndRef}/>
      </div>

      <div style={{ borderTop:'0.5px solid #f1f5f9', paddingTop:10, fontSize:11, color:'#94a3b8', textAlign:'center', marginBottom:8 }}>
        ⚠️ Sun'iy intellekt xato qilishi mumkin — muhim masalalarda yurist bilan maslahatlashing
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <input value={aiInput} onChange={e=>setAiInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendAI()}
          style={{ flex:1, padding:'12px 16px', fontSize:14, background:'#fff', border:'1px solid #e2e8f0', borderRadius:13, outline:'none', fontFamily:'inherit', transition:'border-color 150ms' }}
          onFocus={e=>(e.target as HTMLElement).style.borderColor='#6366f1'}
          onBlur={e=>(e.target as HTMLElement).style.borderColor='#e2e8f0'}
          placeholder="Huquqiy savol yozing..." />
        <button onClick={sendAI} disabled={aiLoading||!aiInput.trim()}
          style={{ width:46, height:46, background: aiLoading||!aiInput.trim() ? '#f1f5f9' : '#0f172a', border:'none', borderRadius:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 150ms' }}>
          <Send size={17} color={aiLoading||!aiInput.trim() ? '#94a3b8' : '#fff'}/>
        </button>
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  )

  // Conversation view
  if (active) return (
    <div style={{ maxWidth:760, margin:'0 auto', height:'calc(100vh - 144px)', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:14, borderBottom:'0.5px solid #f1f5f9' }}>
        <button onClick={()=>setActive(null)} style={{ width:34, height:34, background:'#f8fafc', border:'0.5px solid #e2e8f0', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
          <ArrowLeft size={15} color="#475569"/>
        </button>
        <div style={{ width:40, height:40, background:'linear-gradient(135deg,#0f172a,#4338ca)', color:'#fff', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, flexShrink:0 }}>
          {ini(active.other_name)}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ fontWeight:700, color:'#0f172a', fontSize:15 }}>{active.other_name}</span>
            {active.other_verified && <BadgeCheck size={14} color="#3b82f6"/>}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:11, color:'#94a3b8' }}>@{active.other_username}</span>
            {active.other_role==='lawyer' && parseFloat(active.other_rating)>0 && (
              <span style={{ display:'flex', alignItems:'center', gap:2, fontSize:11, color:'#f59e0b', fontWeight:600 }}>
                <Star size={10} fill="#f59e0b" color="#f59e0b"/> {parseFloat(active.other_rating).toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 0', display:'flex', flexDirection:'column', gap:10 }}>
        {msgs.length===0 && (
          <div style={{ textAlign:'center', padding:40, color:'#94a3b8', fontSize:13 }}>Suhbatni boshlang...</div>
        )}
        {msgs.map(m => {
          const isMine = m.sender_id === user?.id
          return (
            <div key={m.id} style={{ display:'flex', justifyContent: isMine?'flex-end':'flex-start' }}>
              <div style={{ maxWidth:'70%' }}>
                <div style={{ padding:'10px 14px', fontSize:13.5, lineHeight:1.65,
                  borderRadius: isMine?'16px 16px 4px 16px':'16px 16px 16px 4px',
                  background: isMine?'#0f172a':'#f1f5f9', color: isMine?'#fff':'#1e293b' }}>
                  {m.content}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:3, justifyContent: isMine?'flex-end':'flex-start' }}>
                  <span style={{ fontSize:10, color:'#94a3b8' }}>{fmtTime(m.created_at)}</span>
                  {isMine && <CheckCheck size={11} color="#94a3b8"/>}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={endRef}/>
      </div>

      <div style={{ display:'flex', gap:10, borderTop:'0.5px solid #f1f5f9', paddingTop:12 }}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendMsg()}
          style={{ flex:1, padding:'12px 16px', fontSize:14, background:'#fff', border:'1px solid #e2e8f0', borderRadius:13, outline:'none', fontFamily:'inherit' }}
          onFocus={e=>(e.target as HTMLElement).style.borderColor='#6366f1'}
          onBlur={e=>(e.target as HTMLElement).style.borderColor='#e2e8f0'}
          placeholder="Xabar yozing..." />
        <button onClick={sendMsg} disabled={!input.trim()}
          style={{ width:46, height:46, background: !input.trim()?'#f1f5f9':'#0f172a', border:'none', borderRadius:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 150ms' }}>
          <Send size={17} color={!input.trim()?'#94a3b8':'#fff'}/>
        </button>
      </div>
    </div>
  )

  // Conversations list
  return (
    <div style={{ maxWidth:760, margin:'0 auto' }}>
      <h1 style={{ fontSize:22, fontWeight:800, color:'#0f172a', letterSpacing:'-0.4px', marginBottom:20 }}>Suhbatlar</h1>

      {/* AI card — doim birinchi */}
      <div onClick={()=>setShowAI(true)}
        style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', background:'linear-gradient(135deg,#1e1b4b,#312e81)', border:'none', borderRadius:18, cursor:'pointer', marginBottom:16, transition:'transform 200ms', position:'relative', overflow:'hidden' }}
        onMouseEnter={e=>(e.currentTarget as HTMLElement).style.transform='translateY(-2px)'}
        onMouseLeave={e=>(e.currentTarget as HTMLElement).style.transform='translateY(0)'}>
        <div style={{ position:'absolute', right:-20, top:-20, width:100, height:100, background:'rgba(99,102,241,0.2)', borderRadius:'50%' }} />
        <div style={{ width:44, height:44, background:'rgba(255,255,255,0.12)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Sparkles size={22} color="#a5b4fc"/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
            <span style={{ fontWeight:700, color:'#fff', fontSize:15 }}>AI Huquqiy Konsultant</span>
            <span style={{ fontSize:9, fontWeight:700, background:'rgba(255,255,255,0.15)', color:'#fff', padding:'2px 7px', borderRadius:4 }}>AI</span>
          </div>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.65)' }}>Huquqiy savollarga darhol javob — bepul</p>
        </div>
        <div style={{ width:7, height:7, background:'#22c55e', borderRadius:'50%', boxShadow:'0 0 0 3px rgba(34,197,94,0.2)', flexShrink:0 }} />
      </div>

      {/* Conversations */}
      {convs.length===0 ? (
        <div style={{ textAlign:'center', padding:'48px 20px', background:'#fafafa', borderRadius:18, border:'0.5px solid #f1f5f9' }}>
          <div style={{ fontSize:36, marginBottom:12 }}>💬</div>
          <p style={{ fontSize:14, fontWeight:600, color:'#64748b', marginBottom:4 }}>Suhbatlar yo'q</p>
          <p style={{ fontSize:12, color:'#94a3b8' }}>E'lonlar sahifasidan yurist yoki mijozga yozing</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {convs.map(c => (
            <div key={c.id} onClick={()=>openConv(c)}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:14, cursor:'pointer', transition:'all 200ms' }}
              onMouseEnter={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor='#0f172a'; el.style.background='#fafafa' }}
              onMouseLeave={e=>{ const el=e.currentTarget as HTMLElement; el.style.borderColor='#e2e8f0'; el.style.background='#fff' }}>
              <div style={{ width:44, height:44, background:'linear-gradient(135deg,#334155,#475569)', color:'#fff', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, flexShrink:0 }}>
                {ini(c.other_name)}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:'#0f172a' }}>{c.other_name}</span>
                  {c.other_verified && <BadgeCheck size={13} color="#3b82f6"/>}
                  {c.other_role==='lawyer' && parseFloat(c.other_rating)>0 && (
                    <span style={{ display:'flex', alignItems:'center', gap:2, fontSize:11, color:'#f59e0b', fontWeight:600 }}>
                      <Star size={10} fill="#f59e0b" color="#f59e0b"/> {parseFloat(c.other_rating).toFixed(1)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize:12, color:'#94a3b8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {c.last_message||"Suhbat boshlang..."}
                </p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5, flexShrink:0 }}>
                {c.last_message_at && <span style={{ fontSize:10, color:'#94a3b8' }}>{fmtTime(c.last_message_at)}</span>}
                {parseInt(c.unread_count)>0 && (
                  <div style={{ minWidth:18, height:18, background:'#0f172a', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#fff', padding:'0 4px' }}>
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
  return <Suspense fallback={<div style={{ display:'flex', justifyContent:'center', padding:60 }}><Loader2 size={24} color="#94a3b8" style={{ animation:'spin 1s linear infinite' }}/></div>}>
    <ChatContent/>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </Suspense>
}
