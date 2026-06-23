// ════════════════════════════════════════════════
// AdFormModal — umumiy e'lon yaratish modali
// /src/components/AdFormModal.tsx
// ads/page.tsx VA my-ads/page.tsx ikkalasi ishlatadi
// ════════════════════════════════════════════════

'use client'
import { useState } from 'react'
import { X, Check, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react'
import { AD_CATEGORIES, AD_REGIONS, MAX_AD_CATEGORIES, formatPrice } from '@/lib/ads-constants'

interface Props {
  userRole?: string
  onClose: () => void
  onSuccess: (result: any) => void
  onNeedsTerms: () => void
}

export default function AdFormModal({ userRole, onClose, onSuccess, onNeedsTerms }: Props) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    categories: [] as string[],
    region: '',
    is_negotiable: false,
    budget_min: '',
    budget_max: '',
  })
  const [creating, setCreating] = useState(false)
  const [err, setErr] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)  // double-confirm (audit C5)

  // Kategoriya tanlash/bekor qilish (max 4 — audit C6)
  const toggleCategory = (cat: string) => {
    setErr('')
    setForm(f => {
      if (f.categories.includes(cat)) {
        return { ...f, categories: f.categories.filter(c => c !== cat) }
      }
      if (f.categories.length >= MAX_AD_CATEGORIES) {
        setErr(`Eng ko'pi ${MAX_AD_CATEGORIES} ta yo'nalish tanlash mumkin`)
        return f
      }
      return { ...f, categories: [...f.categories, cat] }
    })
  }

  // 1-qadam: validatsiya, keyin tasdiqlash ekrani
  const handleContinue = () => {
    setErr('')
    if (!form.title.trim() || !form.description.trim() || form.categories.length === 0) {
      setErr("Sarlavha, tavsif va kamida bitta yo'nalish majburiy")
      return
    }
    if (form.title.trim().length < 5) {
      setErr('Sarlavha kamida 5 belgi bo\'lishi kerak')
      return
    }
    if (form.description.trim().length < 20) {
      setErr('Tavsif kamida 20 belgi bo\'lishi kerak')
      return
    }
    // Kelishiladi bo'lsa ham minimal narx kerak (audit C2)
    if (form.is_negotiable && (!form.budget_min || parseFloat(form.budget_min) <= 0)) {
      setErr('Kelishiladi tanlansa ham, boshlang\'ich (minimal) narx kiritilishi shart')
      return
    }
    setShowConfirm(true)
  }

  // 2-qadam: yakuniy joylashtirish
  const handleSubmit = async () => {
    setCreating(true)
    setErr('')
    try {
      const res = await fetch('/api/ads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          categories: form.categories,
          city: form.region || null,
          is_negotiable: form.is_negotiable,
          budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
          budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
        }),
      })
      const d = await res.json()
      if (!res.ok) {
        if (d.needsTerms) {
          setCreating(false)
          onNeedsTerms()
          return
        }
        setErr(d.error || 'Xatolik yuz berdi')
        setCreating(false)
        setShowConfirm(false)
        return
      }
      onSuccess(d)
      // E'lon muvaffaqiyatli yaratildi — PWA o'rnatishni taklif qilamiz
      import('@/lib/triggerInstall').then(m => m.maybeOfferInstall()).catch(() => {})
    } catch {
      setErr('Tarmoq xatosi')
      setCreating(false)
      setShowConfirm(false)
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget && !creating) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: '22px 22px 0 0', padding: 28, width: '100%', maxWidth: 600, maxHeight: '92vh', overflowY: 'auto', animation: 'slideUp 0.3s cubic-bezier(.4,0,.2,1)' }}>

        {/* ═══ TASDIQLASH EKRANI (double-confirm) ═══ */}
        {showConfirm ? (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>E'lonni joylashtiramizmi?</h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5 }}>
              E'loningiz AI tomonidan tekshiriladi. Quyidagi ma'lumotlar to'g'rimi?
            </p>

            {/* Xulosa */}
            <div style={{ background: '#f8fafc', borderRadius: 14, padding: 16, marginBottom: 20, border: '1px solid #f1f5f9' }}>
              <Row label="Sarlavha" value={form.title} />
              <Row label="Yo'nalishlar" value={form.categories.join(', ')} />
              {form.region && <Row label="Hudud" value={form.region} />}
              <Row
                label="Narx"
                value={
                  form.budget_min
                    ? `${formatPrice(form.budget_min)} so'm${form.is_negotiable ? ' dan (kelishiladi)' : ''}${form.budget_max ? ` – ${formatPrice(form.budget_max)} so'm` : ''}`
                    : 'Ko\'rsatilmagan'
                }
                last
              />
            </div>

            {err && <div style={{ padding: 12, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>{err}</div>}

            {/* Tugmalar: Tahrirlaymiz / Yo'q / Ha joylaymiz */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={handleSubmit} disabled={creating}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.7 : 1 }}>
                {creating ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Joylashtirilmoqda...</> : <><Check size={16} /> Ha, joylashtirish</>}
              </button>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setShowConfirm(false); setErr('') }} disabled={creating}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <ArrowLeft size={14} /> Tahrirlash
                </button>
                <button onClick={onClose} disabled={creating}
                  style={{ flex: 1, padding: '12px', background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ═══ FORMA EKRANI ═══ */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>Yangi e'lon</h2>
              <button onClick={onClose} style={{ width: 32, height: 32, background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} color="#475569" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Sarlavha */}
              <div>
                <label style={L}>Sarlavha *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  style={I} placeholder="Qisqa va aniq sarlavha" maxLength={200} />
              </div>

              {/* Tavsif */}
              <div>
                <label style={L}>Tavsif *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  style={{ ...I, minHeight: 90, resize: 'vertical' as const }}
                  placeholder={userRole === 'lawyer' ? 'Xizmat tavsifi, tajriba, shartlar...' : 'Muammoingizni batafsil yozing...'} maxLength={5000} />
              </div>

              {/* Yo'nalishlar — ko'p tanlash (max 4) */}
              <div>
                <label style={L}>
                  Yo'nalishlar * <span style={{ color: '#94a3b8', fontWeight: 400 }}>({form.categories.length}/{MAX_AD_CATEGORIES})</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {AD_CATEGORIES.map(cat => {
                    const active = form.categories.includes(cat)
                    return (
                      <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 100,
                          border: `1.5px solid ${active ? '#0f172a' : '#e2e8f0'}`, cursor: 'pointer',
                          fontSize: 12.5, fontWeight: 600, transition: 'all 150ms',
                          background: active ? '#0f172a' : '#fff', color: active ? '#fff' : '#475569',
                        }}>
                        {active && <Check size={12} />} {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Hudud */}
              <div>
                <label style={L}>Hudud</label>
                <select value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} style={I}>
                  <option value="">Tanlang</option>
                  {AD_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Kelishiladi checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 14px', background: form.is_negotiable ? '#f0fdf4' : '#f8fafc', border: `1px solid ${form.is_negotiable ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: 11, transition: 'all 150ms' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                  border: `2px solid ${form.is_negotiable ? '#16a34a' : '#cbd5e1'}`,
                  background: form.is_negotiable ? '#16a34a' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {form.is_negotiable && <Check size={13} color="#fff" />}
                </div>
                <input type="checkbox" checked={form.is_negotiable}
                  onChange={e => setForm(f => ({ ...f, is_negotiable: e.target.checked }))}
                  style={{ display: 'none' }} />
                <div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>Narx kelishiladi</span>
                  <p style={{ fontSize: 11.5, color: '#64748b', marginTop: 1 }}>Belgilangan summadan boshlab kelishuv mumkin</p>
                </div>
              </label>

              {/* Narx maydonlari */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={L}>{form.is_negotiable ? 'Boshlang\'ich narx (so\'m) *' : 'Narx (so\'m)'}</label>
                  <input value={form.budget_min} onChange={e => setForm(f => ({ ...f, budget_min: e.target.value }))}
                    style={I} placeholder="200 000" type="number" min="0" />
                </div>
                <div>
                  <label style={L}>Narx (gacha)</label>
                  <input value={form.budget_max} onChange={e => setForm(f => ({ ...f, budget_max: e.target.value }))}
                    style={I} placeholder="500 000" type="number" min="0" />
                </div>
              </div>

              {err && <div style={{ padding: 12, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>{err}</div>}

              <button onClick={handleContinue}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,23,42,0.2)' }}>
                Davom etish <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: last ? 'none' : '1px solid #e2e8f0' }}>
      <span style={{ fontSize: 12.5, color: '#64748b', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#0f172a', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

const L: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }
const I: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
