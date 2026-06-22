// ════════════════════════════════════════════════
// LocationPicker — yurist ofis joyini xaritada belgilaydi
// /src/components/map/LocationPicker.tsx
// ════════════════════════════════════════════════

'use client'
import { useEffect, useRef, useState } from 'react'
import { useLeaflet } from '@/lib/useLeaflet'
import { MapPin, Loader2, Check, Trash2, Crosshair, X } from 'lucide-react'

interface Props {
  userId: string
  initialLat?: number | null
  initialLng?: number | null
  initialAddress?: string | null
  initialName?: string | null
  initialHours?: string | null
  initialPhotos?: string[] | null
  onSaved?: (lat: number, lng: number, address: string) => void
}

// O'zbekiston markaziy nuqtasi (Toshkent)
const DEFAULT_CENTER: [number, number] = [41.3111, 69.2797]

export default function LocationPicker({ userId, initialLat, initialLng, initialAddress, initialName, initialHours, initialPhotos, onSaved }: Props) {
  const { L, loaded, error } = useLeaflet()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerRef = useRef<any>(null)

  const [coords, setCoords] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  )
  const [address, setAddress] = useState(initialAddress || '')
  const [officeName, setOfficeName] = useState(initialName || '')
  const [officeHours, setOfficeHours] = useState(initialHours || '')
  const [photos, setPhotos] = useState<string[]>(initialPhotos || [])
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')
  const [locating, setLocating] = useState(false)

  // Xaritani yaratish
  useEffect(() => {
    if (!L || !mapRef.current || mapInstance.current) return

    const center = coords || DEFAULT_CENTER
    const map = L.map(mapRef.current, {
      center,
      zoom: coords ? 15 : 12,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)

    // Marker ikoni (lucide MapPin uslubida)
    const icon = L.divIcon({
      className: 'custom-pin',
      html: `<div style="
        width:32px;height:32px;background:#dc2626;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;
      "><div style="width:8px;height:8px;background:#fff;border-radius:50%;transform:rotate(45deg);"></div></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })

    // Agar koordinata bor bo'lsa, marker qo'yamiz
    if (coords) {
      markerRef.current = L.marker(coords, { icon, draggable: true }).addTo(map)
      markerRef.current.on('dragend', (e: any) => {
        const pos = e.target.getLatLng()
        setCoords([pos.lat, pos.lng])
        setSaved(false)
      })
    }

    // Xaritaga bosish → marker qo'yish/ko'chirish
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng
      setCoords([lat, lng])
      setSaved(false)
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
      } else {
        markerRef.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
        markerRef.current.on('dragend', (ev: any) => {
          const pos = ev.target.getLatLng()
          setCoords([pos.lat, pos.lng])
          setSaved(false)
        })
      }
    })

    mapInstance.current = map

    // Xarita to'g'ri render bo'lishi uchun
    setTimeout(() => map.invalidateSize(), 200)

    return () => {
      map.remove()
      mapInstance.current = null
      markerRef.current = null
    }
  }, [L])

  // Mening joylashuvim (GPS)
  const useMyLocation = () => {
    if (!navigator.geolocation) { setErr('Brauzeringiz GPS qo\'llab-quvvatlamaydi'); return }
    setLocating(true)
    setErr('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setCoords([lat, lng])
        setSaved(false)
        if (mapInstance.current) {
          mapInstance.current.setView([lat, lng], 16)
          if (markerRef.current) markerRef.current.setLatLng([lat, lng])
        }
        setLocating(false)
      },
      () => { setErr('Joylashuvni aniqlab bo\'lmadi'); setLocating(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Rasm qo'shish (max 3)
  const handlePhotoUpload = async (file: File) => {
    if (photos.length >= 3) { setErr('Maksimal 3 ta rasm'); return }
    setUploadingPhoto(true)
    setErr('')
    try {
      // Siqish (compressImage bor bo'lsa ishlatamiz)
      let toUpload: Blob = file
      try {
        const mod = await import('@/lib/compressImage')
        toUpload = await mod.compressImage(file, 1400, 0.8)
      } catch {}

      const fd = new FormData()
      fd.append('file', toUpload, file.name)
      const res = await fetch('/api/lawyer/office-photo', { method: 'POST', body: fd })
      const d = await res.json()
      if (d.success && d.url) {
        setPhotos(prev => [...prev, d.url])
        setSaved(false)
      } else {
        setErr(d.error || 'Rasm yuklanmadi')
      }
    } catch {
      setErr('Rasm yuklashda xatolik')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const removePhoto = (url: string) => {
    setPhotos(prev => prev.filter(p => p !== url))
    setSaved(false)
  }

  // Saqlash
  const handleSave = async () => {
    if (!coords) { setErr('Avval xaritada ofis joyini belgilang'); return }
    setSaving(true)
    setErr('')
    try {
      const res = await fetch('/api/lawyer/location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coords[0],
          longitude: coords[1],
          officeAddress: address.trim() || null,
          officeName: officeName.trim() || null,
          officeHours: officeHours.trim() || null,
          officePhotos: photos,
        }),
      })
      const d = await res.json()
      if (!res.ok) {
        setErr(d.error || 'Saqlashda xato')
      } else {
        setSaved(true)
        onSaved?.(coords[0], coords[1], address.trim())
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setErr('Tarmoq xatosi')
    } finally {
      setSaving(false)
    }
  }

  // O'chirish
  const handleRemove = async () => {
    if (!confirm('Ofis joylashuvini xaritadan olib tashlaysizmi?')) return
    setSaving(true)
    try {
      const res = await fetch('/api/lawyer/location', { method: 'DELETE' })
      if (res.ok) {
        setCoords(null)
        setAddress('')
        if (markerRef.current && mapInstance.current) {
          mapInstance.current.removeLayer(markerRef.current)
          markerRef.current = null
        }
      }
    } finally {
      setSaving(false)
    }
  }

  if (error) {
    return (
      <div style={{ padding: 20, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, fontSize: 13, color: '#991b1b' }}>
        Xarita yuklanmadi. Internetni tekshiring va sahifani yangilang.
      </div>
    )
  }

  return (
    <div>
      {/* Yo'riqnoma */}
      <div style={{
        display: 'flex', gap: 10, padding: '10px 14px', marginBottom: 12,
        background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10,
      }}>
        <MapPin size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 12, color: '#1e40af', lineHeight: 1.5, margin: 0 }}>
          Xaritada ofisingiz joylashgan joyga bosing yoki markerni suring. Mijozlar sizni xaritadan topadi.
        </p>
      </div>

      {/* Xarita konteyner */}
      <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        {!loaded && (
          <div style={{
            height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#f8fafc',
          }}>
            <Loader2 size={24} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        <div ref={mapRef} style={{ height: loaded ? 320 : 0, width: '100%' }} />

        {/* GPS tugmasi */}
        {loaded && (
          <button onClick={useMyLocation} disabled={locating} style={{
            position: 'absolute', bottom: 14, right: 14, zIndex: 1000,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 12px', background: '#fff', border: '1px solid #e2e8f0',
            borderRadius: 9, fontSize: 12, fontWeight: 600, color: '#0f172a',
            cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontFamily: 'inherit',
          }}>
            {locating ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Crosshair size={13} />}
            Mening joyim
          </button>
        )}
      </div>

      {/* Tanlangan koordinata */}
      {coords && (
        <div style={{ marginTop: 10, fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={11} />
          {coords[0].toFixed(5)}, {coords[1].toFixed(5)}
        </div>
      )}

      {/* Manzil matni */}
      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
          Ofis manzili (ixtiyoriy)
        </label>
        <input
          value={address}
          onChange={(e) => { setAddress(e.target.value); setSaved(false) }}
          placeholder="Masalan: Amir Temur ko'chasi 1, Toshkent"
          maxLength={200}
          style={{
            width: '100%', padding: '10px 12px', fontSize: 13,
            border: '1px solid #e2e8f0', borderRadius: 10, outline: 'none',
            fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Ofis nomi */}
      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
          Ofis nomi (ixtiyoriy)
        </label>
        <input
          value={officeName}
          onChange={(e) => { setOfficeName(e.target.value); setSaved(false) }}
          placeholder="Masalan: Bosh ofis yoki idora nomi"
          maxLength={100}
          style={{
            width: '100%', padding: '10px 12px', fontSize: 13,
            border: '1px solid #e2e8f0', borderRadius: 10, outline: 'none',
            fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Ish vaqti */}
      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
          Ish vaqti (ixtiyoriy)
        </label>
        <input
          value={officeHours}
          onChange={(e) => { setOfficeHours(e.target.value); setSaved(false) }}
          placeholder="Masalan: Dushanba-Juma, 9:00-18:00"
          maxLength={100}
          style={{
            width: '100%', padding: '10px 12px', fontSize: 13,
            border: '1px solid #e2e8f0', borderRadius: 10, outline: 'none',
            fontFamily: 'inherit', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Ofis rasmlari (max 3) */}
      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
          Ofis rasmlari (ixtiyoriy, max 3)
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {photos.map((url, i) => (
            <div key={i} style={{ position: 'relative', width: 80, height: 80, borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Ofis ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={() => removePhoto(url)}
                style={{ position: 'absolute', top: 3, right: 3, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 6, padding: 3, cursor: 'pointer', display: 'flex' }}>
                <X size={12} color="#fff" />
              </button>
            </div>
          ))}
          {photos.length < 3 && (
            <>
              <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} />
              <button onClick={() => photoInputRef.current?.click()} disabled={uploadingPhoto}
                style={{
                  width: 80, height: 80, borderRadius: 10, border: '1.5px dashed #cbd5e1',
                  background: '#f8fafc', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 4, fontFamily: 'inherit',
                }}>
                {uploadingPhoto ? (
                  <Loader2 size={18} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <>
                    <MapPin size={16} color="#94a3b8" />
                    <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Rasm</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
        <p style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 5 }}>
          Mijozlar ofisingizni xaritada ko'rganda bu rasmlar ko'rinadi
        </p>
      </div>

      {err && (
        <div style={{ marginTop: 10, padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, fontSize: 12, color: '#991b1b' }}>
          {err}
        </div>
      )}

      {/* Tugmalar */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button onClick={handleSave} disabled={!coords || saving} style={{
          flex: 1, padding: '12px', borderRadius: 10, border: 'none',
          background: saved ? '#16a34a' : (!coords || saving ? '#cbd5e1' : '#0f172a'),
          color: '#fff', fontSize: 13, fontWeight: 600,
          cursor: !coords || saving ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit',
        }}>
          {saving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> :
           saved ? <Check size={14} /> : <MapPin size={14} />}
          {saved ? 'Saqlandi' : 'Joylashuvni saqlash'}
        </button>
        {coords && (
          <button onClick={handleRemove} disabled={saving} style={{
            padding: '12px 14px', borderRadius: 10, border: '1px solid #fecaca',
            background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
          }}>
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .leaflet-container { font-family: inherit; }
      `}</style>
    </div>
  )
}
