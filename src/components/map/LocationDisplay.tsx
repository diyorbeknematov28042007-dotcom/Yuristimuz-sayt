// ════════════════════════════════════════════════
// LocationDisplay — yurist profilida ofis xaritasi (read-only)
// /src/components/map/LocationDisplay.tsx
// ════════════════════════════════════════════════

'use client'
import { useEffect, useRef } from 'react'
import { useLeaflet } from '@/lib/useLeaflet'
import { MapPin, Loader2, ExternalLink } from 'lucide-react'

interface Props {
  latitude: number
  longitude: number
  officeAddress?: string | null
  lawyerName?: string
}

export default function LocationDisplay({ latitude, longitude, officeAddress, lawyerName }: Props) {
  const { L, loaded, error } = useLeaflet()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (!L || !mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    const icon = L.divIcon({
      className: 'office-pin',
      html: `<div style="
        width:32px;height:32px;background:#dc2626;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;
      "><div style="width:8px;height:8px;background:#fff;border-radius:50%;transform:rotate(45deg);"></div></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })
    L.marker([latitude, longitude], { icon }).addTo(map)

    mapInstance.current = map
    setTimeout(() => map.invalidateSize(), 200)

    return () => { map.remove(); mapInstance.current = null }
  }, [L, latitude, longitude])

  // Yandex/Google Maps'da ochish havolasi
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`

  if (error) return null  // xarita yuklanmasa, hech narsa ko'rsatmaymiz

  return (
    <div>
      {officeAddress && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10, fontSize: 13, color: '#334155' }}>
          <MapPin size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{officeAddress}</span>
        </div>
      )}

      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        {!loaded && (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <Loader2 size={20} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        <div ref={mapRef} style={{ height: loaded ? 200 : 0, width: '100%' }} />
      </div>

      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10,
        fontSize: 12.5, color: '#4338ca', textDecoration: 'none', fontWeight: 600,
      }}>
        <ExternalLink size={13} /> Yo'l ko'rsatkichini ochish
      </a>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .leaflet-container { font-family: inherit; }
      `}</style>
    </div>
  )
}
