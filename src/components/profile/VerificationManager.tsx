// ════════════════════════════════════════════════
// VERIFIKATSIYA BOSHQARUVCHISI (yurist tomoni)
// /src/components/profile/VerificationManager.tsx
// Litsenziya, ta'lim, sertifikat — yuborish va holatni ko'rish
// ════════════════════════════════════════════════

'use client'

import { useState, useEffect, useRef } from 'react'
import { compressImage } from '@/lib/compressImage'
import {
  ShieldCheck, Upload, FileText, GraduationCap, Award,
  Loader2, CheckCircle2, Clock, XCircle, X, Trash2, Eye
} from 'lucide-react'

type DocType = 'license' | 'education' | 'certificate'

type VDoc = {
  id: string
  doc_type: DocType
  doc_number: string
  holder_name: string
  issued_by: string | null
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  signed_image_url: string | null
  created_at: string
}

// Hujjat turi konfiguratsiyasi
const DOC_CONFIG: Record<DocType, { label: string; icon: any; color: string; bg: string; hasIssuer: boolean; numberLabel: string; numberPlaceholder: string }> = {
  license: {
    label: 'Litsenziya', icon: ShieldCheck, color: '#1d4ed8', bg: '#eff6ff',
    hasIssuer: false, numberLabel: 'Litsenziya raqami', numberPlaceholder: 'Masalan: LN-123456',
  },
  education: {
    label: "Ta'lim", icon: GraduationCap, color: '#7e22ce', bg: '#faf5ff',
    hasIssuer: true, numberLabel: 'Diplom raqami / seriyasi', numberPlaceholder: 'Masalan: AB-1234567',
  },
  certificate: {
    label: 'Sertifikat', icon: Award, color: '#c2410c', bg: '#fff7ed',
    hasIssuer: true, numberLabel: 'Sertifikat raqami', numberPlaceholder: 'Masalan: CERT-2024-001',
  },
}

const STATUS_CONFIG = {
  pending: { label: 'Tekshirilmoqda', icon: Clock, color: '#ca8a04', bg: '#fefce8' },
  approved: { label: 'Tasdiqlangan', icon: CheckCircle2, color: '#16a34a', bg: '#dcfce7' },
  rejected: { label: 'Rad etilgan', icon: XCircle, color: '#dc2626', bg: '#fef2f2' },
}

export default function VerificationManager({ defaultName = '' }: { defaultName?: string }) {
  const [docs, setDocs] = useState<VDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [activeForm, setActiveForm] = useState<DocType | null>(null)
  const [viewImage, setViewImage] = useState<string | null>(null)

  const loadDocs = async () => {
    try {
      const res = await fetch('/api/user/verification')
      const data = await res.json()
      setDocs(data.documents || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { loadDocs() }, [])

  // Har bir tur uchun mavjud hujjatni topamiz
  const docByType = (t: DocType) => docs.find(d => d.doc_type === t)

  if (loading) {
    return (
      <div style={{ padding: '40px 0', textAlign: 'center' }}>
        <Loader2 size={22} color="#cbd5e1" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Sarlavha */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <ShieldCheck size={20} color="#0f172a" />
        <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>Hujjatlar va verifikatsiya</h2>
      </div>
      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
        Litsenziya, ta'lim va sertifikatlaringizni tasdiqlang. Tasdiqlangan hujjatlar profilingizda ishonch belgisi bilan ko'rinadi.
      </p>

      {/* Har bir hujjat turi */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(Object.keys(DOC_CONFIG) as DocType[]).map(type => {
          const cfg = DOC_CONFIG[type]
          const existing = docByType(type)
          const Icon = cfg.icon

          return (
            <div key={type} style={{ border: '0.5px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
              {/* Hujjat sarlavhasi */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', background: '#fff' }}>
                <div style={{ width: 42, height: 42, background: cfg.bg, color: cfg.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{cfg.label}</p>
                  {existing ? (
                    <StatusBadge status={existing.status} />
                  ) : (
                    <p style={{ fontSize: 12, color: '#94a3b8' }}>Hali yuklanmagan</p>
                  )}
                </div>
                {!existing && (
                  <button onClick={() => setActiveForm(activeForm === type ? null : type)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0f172a', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                    <Upload size={14} /> Yuklash
                  </button>
                )}
              </div>

              {/* Mavjud hujjat tafsilotlari */}
              {existing && (
                <div style={{ padding: '0 18px 16px', borderTop: '0.5px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', gap: 16, paddingTop: 14, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{cfg.numberLabel}</p>
                      <p style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 600, marginTop: 2 }}>{existing.doc_number}</p>
                    </div>
                    {existing.issued_by && (
                      <div>
                        <p style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Kim bergan</p>
                        <p style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 600, marginTop: 2 }}>{existing.issued_by}</p>
                      </div>
                    )}
                  </div>

                  {/* Rad etilgan sabab */}
                  {existing.status === 'rejected' && existing.rejection_reason && (
                    <div style={{ marginTop: 12, padding: '10px 12px', background: '#fef2f2', borderRadius: 10, border: '0.5px solid #fecaca' }}>
                      <p style={{ fontSize: 12, color: '#991b1b', lineHeight: 1.5 }}>
                        <strong>Sabab:</strong> {existing.rejection_reason}
                      </p>
                    </div>
                  )}

                  {/* Tugmalar */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    {existing.signed_image_url && (
                      <button onClick={() => setViewImage(existing.signed_image_url)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', color: '#475569', border: '0.5px solid #e2e8f0', borderRadius: 9, padding: '8px 13px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <Eye size={13} /> Hujjatni ko'rish
                      </button>
                    )}
                    {existing.status === 'rejected' && (
                      <DeleteButton docId={existing.id} onDone={loadDocs} />
                    )}
                  </div>
                </div>
              )}

              {/* Yuklash formasi */}
              {activeForm === type && !existing && (
                <UploadForm
                  type={type}
                  defaultName={defaultName}
                  onClose={() => setActiveForm(null)}
                  onDone={() => { setActiveForm(null); loadDocs() }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Rasm ko'rish modal */}
      {viewImage && (
        <div onClick={() => setViewImage(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <button onClick={() => setViewImage(null)}
            style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: 10, cursor: 'pointer' }}>
            <X size={20} color="#fff" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={viewImage} alt="Hujjat" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }} />
        </div>
      )}
    </div>
  )
}

// ── Holat belgisi ──
function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, marginTop: 3 }}>
      <Icon size={12} /> {cfg.label}
    </span>
  )
}

// ── O'chirish tugmasi ──
function DeleteButton({ docId, onDone }: { docId: string; onDone: () => void }) {
  const [deleting, setDeleting] = useState(false)
  const handleDelete = async () => {
    setDeleting(true)
    try {
      await fetch(`/api/user/verification?id=${docId}`, { method: 'DELETE' })
      onDone()
    } catch { setDeleting(false) }
  }
  return (
    <button onClick={handleDelete} disabled={deleting}
      style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fef2f2', color: '#dc2626', border: '0.5px solid #fecaca', borderRadius: 9, padding: '8px 13px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
      {deleting ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
      Qayta yuklash uchun o'chirish
    </button>
  )
}

// ── Yuklash formasi ──
function UploadForm({ type, defaultName, onClose, onDone }: { type: DocType; defaultName: string; onClose: () => void; onDone: () => void }) {
  const cfg = DOC_CONFIG[type]
  const [docNumber, setDocNumber] = useState('')
  const [holderName, setHolderName] = useState(defaultName)
  const [issuedBy, setIssuedBy] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setError('')
    if (f.size > 10 * 1024 * 1024) {
      setError('Fayl hajmi 10MB dan oshmasligi kerak')
      return
    }
    setFile(f)
    if (f.type !== 'application/pdf') {
      setPreview(URL.createObjectURL(f))
    } else {
      setPreview(null)
    }
  }

  const canSubmit = docNumber.trim() && holderName.trim() && file && (!cfg.hasIssuer || issuedBy.trim())

  const handleSubmit = async () => {
    if (!canSubmit || !file) return
    setSubmitting(true)
    setError('')
    try {
      // 1. Rasmni siqish
      const compressed = await compressImage(file)

      // 2. Maxfiy bucket'ga yuklash
      const fd = new FormData()
      fd.append('file', compressed, file.name)
      fd.append('doc_type', type)
      const upRes = await fetch('/api/user/verification/upload', { method: 'POST', body: fd })
      const upData = await upRes.json()
      if (!upData.success) throw new Error(upData.error || 'Yuklashda xatolik')

      // 3. Hujjat ma'lumotlarini saqlash
      const res = await fetch('/api/user/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doc_type: type,
          doc_number: docNumber.trim(),
          holder_name: holderName.trim(),
          issued_by: cfg.hasIssuer ? issuedBy.trim() : null,
          image_path: upData.path,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Saqlashda xatolik')

      onDone()
    } catch (err: any) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: '4px 18px 18px', borderTop: '0.5px solid #f1f5f9', background: '#fafafa' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 16 }}>
        {/* Ism */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Ism va familiya (hujjatdagidek)</label>
          <input value={holderName} onChange={e => setHolderName(e.target.value)}
            placeholder="Ism Familiya"
            style={inputStyle} />
        </div>

        {/* Raqam */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>{cfg.numberLabel}</label>
          <input value={docNumber} onChange={e => setDocNumber(e.target.value)}
            placeholder={cfg.numberPlaceholder}
            style={inputStyle} />
        </div>

        {/* Kim bergan (ta'lim/sertifikat) */}
        {cfg.hasIssuer && (
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Kim bergan (muassasa nomi)</label>
            <input value={issuedBy} onChange={e => setIssuedBy(e.target.value)}
              placeholder="Masalan: TDYU yoki bergan tashkilot"
              style={inputStyle} />
          </div>
        )}

        {/* Rasm yuklash */}
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Hujjat rasmi yoki PDF nusxasi</label>
          <input ref={fileRef} type="file" accept="image/*,application/pdf" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} style={{ display: 'none' }} />

          {!file ? (
            <button onClick={() => fileRef.current?.click()}
              style={{ width: '100%', padding: '24px', border: '1.5px dashed #cbd5e1', borderRadius: 12, background: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
              <Upload size={24} color="#94a3b8" />
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Litsenziya rasmini yoki PDF nusxasini yuklang</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>JPG, PNG yoki PDF · max 10MB</span>
            </button>
          ) : (
            <div style={{ border: '0.5px solid #e2e8f0', borderRadius: 12, padding: 12, background: '#fff', display: 'flex', alignItems: 'center', gap: 12 }}>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Oldindan ko'rish" style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 54, height: 54, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={22} color="#64748b" />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button onClick={() => { setFile(null); setPreview(null) }}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', flexShrink: 0 }}>
                <X size={15} color="#64748b" />
              </button>
            </div>
          )}
        </div>

        {error && (
          <p style={{ fontSize: 12.5, color: '#dc2626', background: '#fef2f2', padding: '9px 12px', borderRadius: 9 }}>{error}</p>
        )}

        {/* Tugmalar */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose}
            style={{ padding: '11px 18px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 11, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Bekor qilish
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit || submitting}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 18px', background: canSubmit && !submitting ? '#0f172a' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: 11, fontSize: 13.5, fontWeight: 700, cursor: canSubmit && !submitting ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
            {submitting ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Yuborilmoqda...</> : <>Tasdiqlashga yuborish</>}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', fontSize: 14, background: '#fff',
  border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box',
}
