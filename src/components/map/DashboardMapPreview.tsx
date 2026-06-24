// ════════════════════════════════════════════════
// DashboardMapPreview — asosiy dashboardda shaffof mini-xarita
// /src/components/map/DashboardMapPreview.tsx
// Bosilsa to'liq xaritaga (/dashboard/lawyers/map) o'tadi
// ════════════════════════════════════════════════

'use client'
import { useEffect, useRef, useState } from 'react'
import { useLeaflet } from '@/lib/useLeaflet'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { MapPin, ArrowRight, Loader2 } from 'lucide-react'

interface MapLawyer {
  id: string
  full_name: string
  latitude: number
  longitude: number
}

const DEFAULT_CENTER: [number, number] = [41.3111, 69.2797]  // Toshkent

export default function DashboardMapPreview() {
  const { L, loaded } = useLeaflet()
  const router = useRouter()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const [lawyers, setLawyers] = useState<MapLawyer[]>([])
  const [count, setCount] = useState(0)

  // Yuristlarni yuklash
  useEffect(() => {
    supabase.rpc('get_lawyers_for_map', { p_specialization: null }).then(({ data }) => {
      if (data) { setLawyers(data); setCount(data.length) }
    })
  }, [])

  // Xaritani yaratish (interaktiv emas — faqat ko'rsatish)
  useEffect(() => {
    if (!L || !mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: 11,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
      attributionControl: false,
    })

    // Och, kulrang tilelar (shaffof, fon kabi)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      opacity: 0.55,
    }).addTo(map)

    mapInstance.current = map
    setTimeout(() => map.invalidateSize(), 200)

    return () => { map.remove(); mapInstance.current = null }
  }, [L])

  // Markerlarni qo'yish
  useEffect(() => {
    if (!L || !mapInstance.current || lawyers.length === 0) return

    const bounds: [number, number][] = []
    lawyers.forEach((lawyer) => {
      const icon = L.divIcon({
        className: 'dash-pin',
        html: `<div style="
          width:26px;height:26px;background:#0f172a;border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
      })
      L.marker([lawyer.latitude, lawyer.longitude], { icon }).addTo(mapInstance.current)
      bounds.push([lawyer.latitude, lawyer.longitude])
    })

    if (bounds.length === 1) {
      mapInstance.current.setView(bounds[0], 12)
    } else if (bounds.length > 1) {
      mapInstance.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 })
    }
  }, [L, lawyers])

  return (
    <div
      onClick={() => router.push('/dashboard/lawyers/map')}
      style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden',
        border: '1px solid #e2e8f0', cursor: 'pointer', marginBottom: 24,
        background: '#f8fafc',
      }}
    >
      {/* Xarita qatlami */}
      <div style={{ position: 'relative', height: 150 }}>
        {!loaded && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={20} color="#cbd5e1" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        <div ref={mapRef} style={{ height: 150, width: '100%' }} />

        {/* Yengil oq gradient overlay (matn o'qilishi uchun) */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.0) 40%, rgba(255,255,255,0.65) 100%)',
        }} />

        {/* Markaziy yorliq */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(255,255,255,0.95)', padding: '9px 16px', borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(226,232,240,0.8)', pointerEvents: 'none',
        }}>
          <MapPin size={15} color="#4338ca" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Xaritani ochish</span>
        </div>
      </div>

      {/* Pastki info paneli */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 16px', background: '#fff', borderTop: '1px solid #f1f5f9',
      }}>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginBottom: 1 }}>
            Yaqin atrofdagi yuristlar
          </p>
          <p style={{ fontSize: 11.5, color: '#94a3b8' }}>
            {count > 0 ? `${count} ta yurist xaritada` : 'Xaritada yuristlarni toping'}
          </p>
        </div>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px',
          background: '#0f172a', color: '#fff', borderRadius: 10,
          fontSize: 12, fontWeight: 600, flexShrink: 0,
        }}>
          Ochish <ArrowRight size={13} />
        </span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .leaflet-container { background: #e8edf2 !important; font-family: inherit; }`}</style>
    </div>
  )
}
