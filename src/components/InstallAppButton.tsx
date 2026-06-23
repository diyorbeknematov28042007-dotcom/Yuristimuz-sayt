// ════════════════════════════════════════════════
// "Ilovani o'rnatish" tugmasi — sozlamalar uchun
// /src/components/InstallAppButton.tsx
// O'chirib yuborgan bo'lsa qayta o'rnatish uchun doimiy joy
// ════════════════════════════════════════════════

'use client'

import { useState, useEffect } from 'react'
import { Download, Check, Loader2 } from 'lucide-react'
import { openInstall, isAppInstalled } from '@/lib/triggerInstall'

export default function InstallAppButton() {
  const [installed, setInstalled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setInstalled(isAppInstalled())
  }, [])

  const handleClick = async () => {
    setLoading(true)
    setMsg('')
    const res = await openInstall()
    setLoading(false)
    if (res === 'installed') {
      setInstalled(true)
    } else if (res === 'ios') {
      // iOS — modal ochildi, qo'shimcha xabar shart emas
    } else if (res === 'unavailable') {
      setMsg('Bu qurilmada avtomatik o\'rnatish mavjud emas. Brauzer menyusidan "Bosh ekranga qo\'shish" ni tanlang.')
    }
  }

  // Allaqachon o'rnatilgan bo'lsa — holat ko'rsatamiz
  if (installed) {
    return (
      <div style={{ padding: '14px 22px', borderBottom: '0.5px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Check size={15} color="#16a34a" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Ilova o'rnatilgan</span>
        </div>
        <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.5, marginTop: 3 }}>
          Yuristim bosh ekraningizda. Rahmat!
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: '14px 22px', borderBottom: '0.5px solid #f1f5f9' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <Download size={14} color="#0f172a" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Ilovani o'rnatish</span>
          </div>
          <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.5 }}>
            Bosh ekraningizga qo'shing — tezroq oching, ilovadek ishlating
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 14px',
            background: '#0f172a', color: '#fff',
            border: 'none', borderRadius: 9,
            fontSize: 12, fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'inherit', flexShrink: 0,
          }}>
          {loading ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={13} />}
          O'rnatish
        </button>
      </div>
      {msg && (
        <div style={{
          marginTop: 10, padding: '8px 11px',
          background: '#fafafa', borderRadius: 8,
          fontSize: 11, color: '#64748b', lineHeight: 1.5,
        }}>
          {msg}
        </div>
      )}
    </div>
  )
}
