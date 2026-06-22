// ════════════════════════════════════════════════
// ADMIN — Verifikatsiya tekshiruvi (client)
// /src/app/admin/verification/VerificationReview.tsx
// ════════════════════════════════════════════════

'use client'

import { useState, useEffect } from 'react'
import {
  ShieldCheck, Clock, CheckCircle2, XCircle, Eye, X,
  Loader2, FileText, GraduationCap, Award, Check, Ban
} from 'lucide-react'

type VDoc = {
  id: string
  user_id: string
  username: string
  full_name: string
  user_avatar: string | null
  doc_type: 'license' | 'education' | 'certificate'
  doc_number: string
  holder_name: string
  issued_by: string | null
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  signed_image_url: string | null
  created_at: string
}

const DOC_LABEL = { license: 'Litsenziya', education: "Ta'lim", certificate: 'Sertifikat' }
const DOC_ICON = { license: ShieldCheck, education: GraduationCap, certificate: Award }
const TABS = [
  { key: 'pending', label: 'Kutilmoqda', icon: Clock },
  { key: 'approved', label: 'Tasdiqlangan', icon: CheckCircle2 },
  { key: 'rejected', label: 'Rad etilgan', icon: XCircle },
]

export default function VerificationReview() {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [docs, setDocs] = useState<VDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [viewImage, setViewImage] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)

  const load = async (status: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/verification?status=${status}`)
      const data = await res.json()
      setDocs(data.documents || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load(tab) }, [tab])

  const handleApprove = async (docId: string) => {
    setProcessing(docId)
    try {
      await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_id: docId, action: 'approve' }),
      })
      load(tab)
    } catch {}
    setProcessing(null)
  }

  const handleReject = async (docId: string) => {
    if (!rejectReason.trim()) return
    setProcessing(docId)
    try {
      await fetch('/api/admin/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doc_id: docId, action: 'reject', reason: rejectReason.trim() }),
      })
      setRejectingId(null)
      setRejectReason('')
      load(tab)
    } catch {}
    setProcessing(null)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '8px 4px 40px' }}>
      {/* Sarlavha */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <ShieldCheck size={22} color="#0f172a" />
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Verifikatsiya</h1>
          <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 2 }}>Yuristlar hujjatlarini tekshiring va tasdiqlang</p>
        </div>
      </div>

      {/* Tablar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '0.5px solid #e2e8f0', paddingBottom: 0 }}>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.key
          return (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: 'none', border: 'none', borderBottom: active ? '2px solid #0f172a' : '2px solid transparent', color: active ? '#0f172a' : '#94a3b8', fontSize: 13.5, fontWeight: active ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: -1 }}>
              <Icon size={15} /> {t.label}
            </button>
          )
        })}
      </div>

      {/* Ro'yxat */}
      {loading ? (
        <div style={{ padding: '50px 0', textAlign: 'center' }}>
          <Loader2 size={24} color="#cbd5e1" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : docs.length === 0 ? (
        <div style={{ padding: '50px 20px', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, background: '#f1f5f9', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <ShieldCheck size={22} color="#94a3b8" />
          </div>
          <p style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}>Bu bo'limda hujjat yo'q</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {docs.map(doc => {
            const Icon = DOC_ICON[doc.doc_type]
            return (
              <div key={doc.id} style={{ border: '0.5px solid #e2e8f0', borderRadius: 16, padding: 18, background: '#fff' }}>
                {/* Yurist + hujjat turi */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: doc.user_avatar ? '#f1f5f9' : 'linear-gradient(135deg,#0f172a,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {doc.user_avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={doc.user_avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{(doc.full_name || doc.username || '?').slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>{doc.full_name}</p>
                    <p style={{ fontSize: 12.5, color: '#94a3b8' }}>@{doc.username}</p>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f8fafc', color: '#475569', fontSize: 12, fontWeight: 600, padding: '6px 11px', borderRadius: 8, border: '0.5px solid #e2e8f0' }}>
                    <Icon size={14} /> {DOC_LABEL[doc.doc_type]}
                  </span>
                </div>

                {/* Tafsilotlar */}
                <div style={{ display: 'flex', gap: 20, padding: '14px 16px', background: '#fafafa', borderRadius: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Raqami</p>
                    <p style={{ fontSize: 14, color: '#0f172a', fontWeight: 700, marginTop: 2 }}>{doc.doc_number}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Egasi</p>
                    <p style={{ fontSize: 14, color: '#0f172a', fontWeight: 700, marginTop: 2 }}>{doc.holder_name}</p>
                  </div>
                  {doc.issued_by && (
                    <div>
                      <p style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Kim bergan</p>
                      <p style={{ fontSize: 14, color: '#0f172a', fontWeight: 700, marginTop: 2 }}>{doc.issued_by}</p>
                    </div>
                  )}
                </div>

                {/* Rad etilgan sabab */}
                {doc.status === 'rejected' && doc.rejection_reason && (
                  <div style={{ padding: '10px 12px', background: '#fef2f2', borderRadius: 10, marginBottom: 14, border: '0.5px solid #fecaca' }}>
                    <p style={{ fontSize: 12.5, color: '#991b1b' }}><strong>Rad sababi:</strong> {doc.rejection_reason}</p>
                  </div>
                )}

                {/* Rad etish formasi */}
                {rejectingId === doc.id ? (
                  <div style={{ marginBottom: 4 }}>
                    <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      placeholder="Rad etish sababini yozing (yuristga ko'rinadi)..."
                      rows={2}
                      style={{ width: '100%', padding: '10px 12px', fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 10, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setRejectingId(null); setRejectReason('') }}
                        style={{ padding: '9px 14px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Bekor
                      </button>
                      <button onClick={() => handleReject(doc.id)} disabled={!rejectReason.trim() || processing === doc.id}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 14px', background: rejectReason.trim() ? '#dc2626' : '#fca5a5', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: rejectReason.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
                        {processing === doc.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Ban size={14} />} Rad etishni tasdiqlash
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Asosiy tugmalar */
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {doc.signed_image_url && (
                      <button onClick={() => setViewImage(doc.signed_image_url)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', color: '#475569', border: '0.5px solid #e2e8f0', borderRadius: 10, padding: '10px 15px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <Eye size={14} /> Hujjatni ko'rish
                      </button>
                    )}
                    {doc.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(doc.id)} disabled={processing === doc.id}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                          {processing === doc.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />} Tasdiqlash
                        </button>
                        <button onClick={() => setRejectingId(doc.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                          <Ban size={14} /> Rad etish
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

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

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
