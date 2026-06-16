// ════════════════════════════════════════════════
// LawyersMap — mijoz yuristlarni xaritada ko'radi
// /src/components/map/LawyersMap.tsx
// ════════════════════════════════════════════════

'use client'
import { useEffect, useRef, useState } from 'react'
import { useLeaflet } from '@/lib/useLeaflet'
import { supabase } from '@/lib/supabase'
import { Loader2, MapPin, Star, ShieldCheck, X, Crosshair } from 'lucide-react'
import Link from 'next/link'

interface MapLawyer {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  latitude: number
  longitude: number
  office_address: string | null
  specialization: string[] | null
  rating: number
  total_reviews: number
  is_verified: boolean
  hourly_rate: number | null
}

const DEFAULT_CENTER: [number, number] = [41.3111, 69.2797]  // Toshkent

export default function LawyersMap() {
  const { L, loaded, error } = useLeaflet()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersLayer = useRef<any>(null)

  const [lawyers, setLawyers] = useState<MapLawyer[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<MapLawyer | null>(null)

  // Yuristlarni yuklash
  useEffect(() => {
    supabase.rpc('get_lawyers_for_map', { p_specialization: null }).then(({ data }) => {
      if (data) setLawyers(data)
      setLoading(false)
    })
  }, [])

  // Xaritani yaratish
  useEffect(() => {
    if (!L || !mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: 6,  // butun O'zbekiston ko'rinadi
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    markersLayer.current = L.layerGroup().addTo(map)
    mapInstance.current = map
    setTimeout(() => map.invalidateSize(), 200)

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [L])

  // Markerlarni qo'yish
  useEffect(() => {
    if (!L || !mapInstance.current || !markersLayer.current || lawyers.length === 0) return

    markersLayer.current.clearLayers()
    const bounds: [number, number][] = []

    lawyers.forEach((lawyer) => {
      const icon = L.divIcon({
        className: 'lawyer-pin',
        html: `<div style="
          width:36px;height:36px;background:#0f172a;border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;cursor:pointer;
        ">
          <span style="transform:rotate(45deg);color:#fff;font-size:15px;font-weight:700;">
            ${(lawyer.full_name || '?').charAt(0).toUpperCase()}
          </span>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      })

      const marker = L.marker([lawyer.latitude, lawyer.longitude], { icon })
      marker.on('click', () => {
        setSelected(lawyer)
        mapInstance.current.setView([lawyer.latitude, lawyer.longitude], 15)
      })
      markersLayer.current.addLayer(marker)
      bounds.push([lawyer.latitude, lawyer.longitude])
    })

    // Barcha markerlar ko'rinadigan qilib masshtablash
    if (bounds.length === 1) {
      mapInstance.current.setView(bounds[0], 13)
    } else if (bounds.length > 1) {
      mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
    }
  }, [L, lawyers])

  const recenter = () => {
    if (!mapInstance.current || lawyers.length === 0) return
    const bounds = lawyers.map(l => [l.latitude, l.longitude] as [number, number])
    if (bounds.length === 1) mapInstance.current.setView(bounds[0], 13)
    else mapInstance.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 })
  }

  if (error) {
    return (
      <div style={{ padding: 30, textAlign: 'center', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, fontSize: 13, color: '#991b1b' }}>
        Xarita yuklanmadi. Internetni tekshiring.
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Yuristlar soni */}
      <div style={{
        position: 'absolute', top: 14, left: 14, zIndex: 1000,
        padding: '8px 14px', background: '#fff', borderRadius: 999,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: 12.5, fontWeight: 700, color: '#0f172a',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <MapPin size={13} color="#0f172a" />
        {loading ? 'Yuklanmoqda...' : `${lawyers.length} ta yurist`}
      </div>

      {/* Xarita */}
      <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        {!loaded && (
          <div style={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <Loader2 size={24} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        <div ref={mapRef} style={{ height: loaded ? 420 : 0, width: '100%' }} />

        {loaded && lawyers.length > 0 && (
          <button onClick={recenter} style={{
            position: 'absolute', bottom: 14, right: 14, zIndex: 1000,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 12px', background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: 9, fontSize: 12, fontWeight: 600, color: '#0f172a',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontFamily: 'inherit',
          }}>
            <Crosshair size={13} /> Barchasi
          </button>
        )}
      </div>

      {/* Bo'sh holat */}
      {loaded && !loading && lawyers.length === 0 && (
        <div style={{ marginTop: 12, padding: 20, textAlign: 'center', background: '#f8fafc', borderRadius: 12, fontSize: 13, color: '#64748b' }}>
          Hozircha xaritada yuristlar yo'q. Yuristlar joylashuvini qo'shgach, bu yerda ko'rinadi.
        </div>
      )}

      {/* Tanlangan yurist kartochkasi */}
      {selected && (
        <div style={{
          position: 'absolute', bottom: 14, left: 14, right: 14, zIndex: 1001,
          maxWidth: 380, margin: '0 auto',
          background: '#fff', borderRadius: 14, padding: 16,
          boxShadow: '0 10px 40px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0',
        }}>
          <button onClick={() => setSelected(null)} style={{
            position: 'absolute', top: 12, right: 12,
            background: '#f1f5f9', border: 'none', borderRadius: 7, padding: 5,
            cursor: 'pointer', display: 'flex',
          }}>
            <X size={14} />
          </button>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            {selected.avatar_url ? (
              <img src={selected.avatar_url} alt={selected.full_name} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{
                width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg, #4338ca, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700, flexShrink: 0,
              }}>
                {(selected.full_name || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{selected.full_name}</span>
                {selected.is_verified && <ShieldCheck size={14} color="#16a34a" />}
              </div>
              {selected.rating > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b', marginBottom: 3 }}>
                  <Star size={12} fill="#fbbf24" color="#fbbf24" />
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{Number(selected.rating).toFixed(1)}</span>
                  <span>({selected.total_reviews})</span>
                </div>
              )}
              {selected.office_address && (
                <div style={{ fontSize: 11.5, color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                  <MapPin size={11} style={{ flexShrink: 0, marginTop: 2 }} /> {selected.office_address}
                </div>
              )}
            </div>
          </div>

          {/* Mutaxassislik */}
          {selected.specialization && selected.specialization.length > 0 && (
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
              {selected.specialization.slice(0, 3).map((s, i) => (
                <span key={i} style={{ padding: '3px 9px', background: '#eef2ff', color: '#4338ca', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
                  {s}
                </span>
              ))}
            </div>
          )}

          <Link href={`/yurist/${selected.username}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '11px', background: '#0f172a', color: '#fff', borderRadius: 10,
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}>
            Profilni ko'rish
          </Link>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .leaflet-container { font-family: inherit; }
      `}</style>
    </div>
  )
}
