'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Conversation, Message, Profile } from '@/lib/types'
import { timeAgo } from '@/lib/utils'

export default function ChatPage() {
  const supabase = createClient()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
      if (!user) return
      const { data } = await supabase
        .from('conversations')
        .select('*, client:client_id(full_name), lawyer:lawyer_id(full_name)')
        .or(`client_id.eq.${user.id},lawyer_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })
      setConversations(data || [])
    }
    init()
  }, [])

  useEffect(() => {
    if (!activeConv) return
    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, profiles(full_name)')
        .eq('conversation_id', activeConv.id)
        .order('created_at', { ascending: true })
      setMessages(data || [])
    }
    loadMessages()

    const channel = supabase
      .channel(`conv-${activeConv.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${activeConv.id}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeConv])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConv || !currentUser) return
    setSending(true)
    await supabase.from('messages').insert({
      conversation_id: activeConv.id,
      sender_id: currentUser.id,
      content: newMessage.trim(),
    })
    setNewMessage('')
    setSending(false)
  }

  const getOtherName = (conv: Conversation) => {
    if (!currentUser) return '...'
    return currentUser.id === conv.client_id
      ? (conv as any).lawyer?.full_name
      : (conv as any).client?.full_name
  }

  return (
    <div className="card overflow-hidden" style={{ height: 'calc(100vh - 8rem)' }}>
      <div className="flex h-full">
        {/* Conversations list */}
        <div className="w-64 border-r border-gray-100 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Chatlar</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && (
              <div className="p-6 text-center text-gray-400 text-sm">
                <p className="text-3xl mb-2">💬</p>
                <p>Chatlar yo'q</p>
                <p className="mt-1">Yurist elon sahifasidan yozing</p>
              </div>
            )}
            {conversations.map((conv) => (
              <button key={conv.id} onClick={() => setActiveConv(conv)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                  activeConv?.id === conv.id ? 'bg-blue-50' : ''
                }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm font-medium">
                      {getOtherName(conv)?.[0] || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{getOtherName(conv)}</p>
                    <p className="text-xs text-gray-400 truncate">{conv.last_message || 'Xabar yo\'q'}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeConv ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-5xl mb-3">💬</p>
                <p>Chat tanlang</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100">
                <p className="font-semibold text-gray-900">{getOtherName(activeConv)}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === currentUser?.id
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs rounded-2xl px-4 py-2 ${
                        isMe ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                          {timeAgo(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-100 flex gap-3">
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)}
                  className="input flex-1" placeholder="Xabar yozing..." />
                <button type="submit" disabled={sending || !newMessage.trim()} className="btn-primary">
                  Yuborish
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
