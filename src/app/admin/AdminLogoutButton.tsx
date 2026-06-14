// ════════════════════════════════════════════════
// ADMIN LOGOUT BUTTON (client component)
// /src/app/admin/AdminLogoutButton.tsx
// ════════════════════════════════════════════════

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'

export default function AdminLogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (loading) return
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error('Logout xato:', err)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 8,
        color: '#dc2626',
        fontSize: 12,
        fontWeight: 600,
        cursor: loading ? 'wait' : 'pointer',
        fontFamily: 'inherit',
      }}>
      {loading ? (
        <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        <LogOut size={13} />
      )}
      Chiqish
    </button>
  )
}
