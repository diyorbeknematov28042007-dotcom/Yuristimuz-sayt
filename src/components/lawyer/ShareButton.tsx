'use client'

import { useState } from 'react'
import { Share2, Copy, Check, MessageCircle, Send, X } from 'lucide-react'

type Props = {
  url: string
  name: string
}

export default function ShareButton({ url, name }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareText = `${name} — Yuristim platformasidagi yurist profili`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: name,
          text: shareText,
          url: url,
        })
      } catch {
        setOpen(true)
      }
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <button onClick={shareNative}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '13px 18px', background: '#fff', color: '#0f172a',
          border: '1px solid #e2e8f0', borderRadius: 12,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'inherit', transition: 'all 150ms',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0f172a'; el.style.background = '#f8fafc' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e2e8f0'; el.style.background = '#fff' }}>
        <Share2 size={15} /> Ulashish
      </button>

      {open && (
        <div onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(6px)',
            zIndex: 200,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}>
          <div onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '22px 22px 0 0',
              padding: '24px 20px 32px',
              width: '100%',
              maxWidth: 480,
              animation: 'slideUp 0.25s cubic-bezier(.4,0,.2,1)',
            }}>

            {/* Drag handle */}
            <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 100, margin: '0 auto 18px' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Profilni ulashish</h3>
              <button onClick={() => setOpen(false)}
                style={{ width: 30, height: 30, background: '#f1f5f9', border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={14} color="#475569" />
              </button>
            </div>

            {/* URL display + copy */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', background: '#f8fafc',
              border: '1px solid #e2e8f0', borderRadius: 11, marginBottom: 16,
            }}>
              <span style={{ flex: 1, fontSize: 12.5, color: '#475569', fontFamily: 'ui-monospace, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {url}
              </span>
              <button onClick={handleCopy}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 12px',
                  background: copied ? '#22c55e' : '#0f172a',
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'inherit', flexShrink: 0,
                  transition: 'all 200ms',
                }}>
                {copied ? <><Check size={12} /> Nusxalandi</> : <><Copy size={12} /> Nusxalash</>}
              </button>
            </div>

            {/* Quick share options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>

              {/* Telegram */}
              <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, textDecoration: 'none', transition: 'all 150ms' }}>
                <div style={{ width: 38, height: 38, background: '#0088cc', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={18} color="#fff" />
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#0c4a6e' }}>Telegram</span>
              </a>

              {/* WhatsApp */}
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' — ' + url)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, textDecoration: 'none', transition: 'all 150ms' }}>
                <div style={{ width: 38, height: 38, background: '#25d366', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={18} color="#fff" />
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#14532d' }}>WhatsApp</span>
              </a>

              {/* Email */}
              <a href={`mailto:?subject=${encodeURIComponent(name + ' — Yuristim')}&body=${encodeURIComponent(shareText + '\n\n' + url)}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '14px 8px', background: '#fafafa', border: '1px solid #e2e8f0', borderRadius: 12, textDecoration: 'none', transition: 'all 150ms' }}>
                <div style={{ width: 38, height: 38, background: '#64748b', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  ✉️
                </div>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: '#334155' }}>Email</span>
              </a>
            </div>

            <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 16, lineHeight: 1.55 }}>
              Profil havolasini istalgan joyda ulashishingiz mumkin
            </p>
          </div>

          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          `}</style>
        </div>
      )}
    </>
  )
}
