'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, AlertCircle, X } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/login')
      router.refresh()
    } catch {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Trigger tugma */}
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#94a3b8', padding: 6, borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 150ms',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.background = '#fef2f2' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
        title="Chiqish">
        <LogOut size={15} />
      </button>

      {/* Confirm modal */}
      {showConfirm && (
        <div
          onClick={() => !loading && setShowConfirm(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
            animation: 'fadeIn 0.2s ease',
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 28,
              maxWidth: 400,
              width: '100%',
              boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              animation: 'slideUp 0.25s cubic-bezier(.4,0,.2,1)',
              position: 'relative',
            }}>

            {/* Close X */}
            <button
              onClick={() => !loading && setShowConfirm(false)}
              disabled={loading}
              style={{
                position: 'absolute', top: 14, right: 14,
                width: 30, height: 30,
                background: '#f1f5f9', border: 'none', borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: loading ? 0.5 : 1,
              }}>
              <X size={14} color="#475569" />
            </button>

            {/* Icon */}
            <div style={{
              width: 52, height: 52,
              background: 'linear-gradient(135deg, #fef2f2, #fecaca)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 18,
            }}>
              <LogOut size={24} color="#dc2626" />
            </div>

            {/* Title + Description */}
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', marginBottom: 6 }}>
              Chiqishni tasdiqlang
            </h3>
            <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.65, marginBottom: 22 }}>
              Tizimdan chiqmoqchimisiz? Keyingi safar qayta kirish uchun login va parolingiz kerak bo'ladi.
            </p>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '11px',
                  background: '#f1f5f9',
                  border: 'none', borderRadius: 11,
                  fontSize: 14, fontWeight: 600, color: '#475569',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 150ms',
                }}>
                Bekor qilish
              </button>
              <button
                onClick={handleLogout}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '11px',
                  background: loading ? '#fca5a5' : '#dc2626',
                  color: '#fff',
                  border: 'none', borderRadius: 11,
                  fontSize: 14, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(220,38,38,0.3)',
                  transition: 'all 150ms',
                }}>
                {loading ? 'Chiqilmoqda...' : <><LogOut size={14} /> Ha, chiqish</>}
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { transform: translateY(20px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
          `}</style>
        </div>
      )}
    </>
  )
}
