// ════════════════════════════════════════════════
// UMUMIY AVATAR KOMPONENTI
// /src/components/Avatar.tsx
// Profil rasmi bo'lsa — rasm, bo'lmasa — ism harflari
// HAMMA JOYDA ishlatiladi: ro'yxat, profil, tavsiyalar, chat, xarita
// ════════════════════════════════════════════════

'use client'

type AvatarProps = {
  src?: string | null          // avatar_url
  name?: string | null         // full_name yoki username (harf uchun)
  size?: number                // piksel
  rounded?: number             // burchak radiusi (default: doira emas, yumaloq kvadrat)
  circle?: boolean             // to'liq doira bo'lsinmi
}

export default function Avatar({ src, name, size = 40, rounded, circle = false }: AvatarProps) {
  // Ism harflari (masalan "Diyorbek Nematov" -> "DN")
  const initials = (name || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'

  const radius = circle ? '50%' : (rounded ?? Math.round(size * 0.28))

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: radius,
      overflow: 'hidden',
      flexShrink: 0,
      background: src ? '#f1f5f9' : 'linear-gradient(135deg,#0f172a,#4338ca)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ color: '#fff', fontWeight: 800, fontSize: Math.round(size * 0.38) }}>
          {initials}
        </span>
      )}
    </div>
  )
}
