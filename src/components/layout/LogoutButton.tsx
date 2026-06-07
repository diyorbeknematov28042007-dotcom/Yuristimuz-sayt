'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: '#94a3b8', padding: 6, borderRadius: 7,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      title="Chiqish">
      <LogOut size={15} />
    </button>
  )
}
