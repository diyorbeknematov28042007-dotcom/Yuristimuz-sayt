'use client'

import { useState } from 'react'

type Props = {
  src?: string | null
  name: string
  size?: number
  fontSize?: number
  borderRadius?: number
  showRing?: boolean
}

export default function Avatar({
  src,
  name,
  size = 50,
  fontSize,
  borderRadius,
  showRing = false,
}: Props) {
  const [imgError, setImgError] = useState(false)

  const initials = name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  const finalFontSize = fontSize || Math.max(11, Math.floor(size * 0.36))
  const finalRadius = borderRadius ?? Math.floor(size * 0.28)

  // Rasm mavjud va xato yo'q bo'lsa
  if (src && !imgError) {
    return (
      <div style={{
        width: size, height: size,
        borderRadius: finalRadius,
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative',
        boxShadow: showRing ? '0 0 0 3px #fff, 0 0 0 4px #e2e8f0' : 'none',
      }}>
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    )
  }

  // Fallback: initial harflar gradient bilan
  return (
    <div style={{
      width: size, height: size,
      background: 'linear-gradient(135deg, #0f172a, #4338ca)',
      color: '#fff',
      borderRadius: finalRadius,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: finalFontSize,
      flexShrink: 0,
      boxShadow: showRing ? '0 0 0 3px #fff, 0 0 0 4px #e2e8f0' : 'none',
    }}>
      {initials}
    </div>
  )
}
