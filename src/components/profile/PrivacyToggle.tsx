// ════════════════════════════════════════════════
// PUBLIC/PRIVATE TOGGLE (messengerdagidek)
// /src/components/profile/PrivacyToggle.tsx
// Har bir profil maydoni yonida — hammaga ko'rinadimi yoki yo'q
// ════════════════════════════════════════════════

'use client'

import { Eye, EyeOff } from 'lucide-react'

type Props = {
  isPublic: boolean
  onChange: (next: boolean) => void
  size?: 'sm' | 'md'
}

export default function PrivacyToggle({ isPublic, onChange, size = 'md' }: Props) {
  const isSm = size === 'sm'
  return (
    <button
      type="button"
      onClick={() => onChange(!isPublic)}
      title={isPublic ? 'Hammaga ko\'rinadi' : 'Faqat sizga ko\'rinadi'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: isSm ? '4px 9px' : '6px 11px',
        background: isPublic ? '#eff6ff' : '#f8fafc',
        border: `1px solid ${isPublic ? '#bfdbfe' : '#e2e8f0'}`,
        borderRadius: 8,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 150ms',
        flexShrink: 0,
      }}>
      {isPublic ? (
        <Eye size={isSm ? 12 : 13} color="#2563eb" />
      ) : (
        <EyeOff size={isSm ? 12 : 13} color="#94a3b8" />
      )}
      <span style={{
        fontSize: isSm ? 11 : 11.5,
        fontWeight: 600,
        color: isPublic ? '#2563eb' : '#94a3b8',
      }}>
        {isPublic ? 'Ochiq' : 'Yashirin'}
      </span>
    </button>
  )
}
