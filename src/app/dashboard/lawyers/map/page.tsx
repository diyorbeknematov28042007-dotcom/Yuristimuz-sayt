// ════════════════════════════════════════════════
// Yuristlar xaritasi sahifasi (mijoz uchun)
// /src/app/dashboard/lawyers/map/page.tsx
// ════════════════════════════════════════════════

'use client'
import Link from 'next/link'
import { ChevronLeft, Map as MapIcon, List } from 'lucide-react'
import LawyersMap from '@/components/map/LawyersMap'

export default function LawyersMapPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/dashboard/lawyers" style={{
            display: 'flex', alignItems: 'center', color: '#64748b', textDecoration: 'none',
          }}>
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>
              Yuristlar xaritasi
            </h1>
            <p style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>
              Yaqiningizdagi yuristni toping
            </p>
          </div>
        </div>

        {/* Ro'yxat ko'rinishiga o'tish */}
        <Link href="/dashboard/lawyers" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 10, fontSize: 12.5, fontWeight: 600, color: '#475569', textDecoration: 'none',
        }}>
          <List size={14} /> Ro'yxat
        </Link>
      </div>

      <LawyersMap />
    </div>
  )
}
