'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

type Props = {
  value: number
  onChange?: (rating: number) => void
  size?: number
  readonly?: boolean
  showLabel?: boolean
}

const LABELS: Record<number, string> = {
  1: "Yomon",
  2: "O'rtacha",
  3: "Yaxshi",
  4: "Juda yaxshi",
  5: "Ajoyib",
}

export default function StarRating({
  value,
  onChange,
  size = 24,
  readonly = false,
  showLabel = false,
}: Props) {
  const [hover, setHover] = useState(0)
  const display = hover || value

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(star => {
          const filled = star <= display
          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => !readonly && onChange?.(star)}
              onMouseEnter={() => !readonly && setHover(star)}
              onMouseLeave={() => !readonly && setHover(0)}
              style={{
                background: 'none', border: 'none',
                cursor: readonly ? 'default' : 'pointer',
                padding: 2,
                transition: 'transform 100ms',
                transform: hover === star && !readonly ? 'scale(1.15)' : 'scale(1)',
              }}>
              <Star
                size={size}
                color={filled ? '#f59e0b' : '#cbd5e1'}
                fill={filled ? '#f59e0b' : 'transparent'}
                strokeWidth={filled ? 1.5 : 1.8}
              />
            </button>
          )
        })}
      </div>
      {showLabel && display > 0 && (
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: hover ? '#f59e0b' : '#475569',
          transition: 'color 150ms',
        }}>
          {LABELS[display]}
        </span>
      )}
    </div>
  )
}
