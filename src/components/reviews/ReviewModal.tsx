'use client'

import { useState, useEffect } from 'react'
import { X, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import StarRating from './StarRating'

type Props = {
  isOpen: boolean
  onClose: () => void
  lawyerId: string
  lawyerName: string
  clientId: string
  existingReview?: {
    id: string
    rating: number
    comment: string | null
  } | null
  onSuccess?: () => void
}

export default function ReviewModal({
  isOpen,
  onClose,
  lawyerId,
  lawyerName,
  clientId,
  existingReview,
  onSuccess,
}: Props) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Existing review yuklash
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating)
      setComment(existingReview.comment || '')
    } else {
      setRating(0)
      setComment('')
    }
    setError('')
    setSuccess(false)
  }, [existingReview, isOpen])

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Iltimos yulduz baho qoying")
      return
    }

    setSaving(true)
    setError('')

    try {
      const { error: rpcError } = await supabase.rpc('add_or_update_review', {
        p_client_id: clientId,
        p_lawyer_id: lawyerId,
        p_rating: rating,
        p_comment: comment.trim() || null,
        p_conversation_id: null,
      })

      if (rpcError) {
        if (rpcError.message.includes('no_conversation_yet')) {
          setError("Avval ushbu yurist bilan suhbatlashishingiz kerak. Baho berish uchun yuristga xabar yuboring.")
        } else if (rpcError.message.includes('cannot_review_self')) {
          setError("O'zingizga baho bera olmaysiz")
        } else if (rpcError.message.includes('target_not_lawyer')) {
          setError("Faqat yuristlarga baho berish mumkin")
        } else {
          setError("Saqlashda xato: " + rpcError.message)
        }
        setSaving(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1200)
    } catch (err) {
      setError("Tarmoq xatosi")
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      onClick={() => !saving && onClose()}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 200,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '22px 22px 0 0',
          padding: '24px 22px 32px',
          width: '100%',
          maxWidth: 480,
          maxHeight: '92vh',
          overflowY: 'auto',
          animation: 'slideUp 0.25s cubic-bezier(.4,0,.2,1)',
        }}>

        {/* Drag handle */}
        <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 100, margin: '0 auto 18px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
              {existingReview ? "Sharhni tahrirlash" : "Sharh qoldiring"}
            </h3>
            <p style={{ fontSize: 12.5, color: '#64748b', marginTop: 3 }}>
              {lawyerName} haqida
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              width: 30, height: 30,
              background: '#f1f5f9', border: 'none', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.5 : 1,
            }}>
            <X size={14} color="#475569" />
          </button>
        </div>

        {/* Rating */}
        <div style={{
          background: '#fafafa', border: '0.5px solid #e2e8f0',
          borderRadius: 14, padding: '18px 16px',
          marginTop: 18, marginBottom: 16,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Bahoyingiz
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: rating > 0 ? 8 : 0 }}>
            <StarRating value={rating} onChange={setRating} size={36} />
          </div>
          {rating > 0 && (
            <p style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>
              {rating === 5 ? "Ajoyib! ⭐"
                : rating === 4 ? "Juda yaxshi"
                : rating === 3 ? "Yaxshi"
                : rating === 2 ? "O'rtacha"
                : "Yomon"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block', fontSize: 12, fontWeight: 600, color: '#475569',
            marginBottom: 7,
          }}>
            Izoh qoldiring (ixtiyoriy)
            <span style={{ marginLeft: 5, fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
              {comment.length}/500
            </span>
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value.slice(0, 500))}
            placeholder="Tajribangiz haqida yozing — boshqa mijozlarga foydali bo'ladi..."
            rows={4}
            style={{
              width: '100%', padding: '10px 14px', fontSize: 14,
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 11,
              color: '#0f172a', outline: 'none',
              fontFamily: 'inherit', resize: 'vertical' as const,
              minHeight: 80,
              boxSizing: 'border-box' as const,
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '10px 12px',
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 10, marginBottom: 14,
            display: 'flex', alignItems: 'flex-start', gap: 8,
            fontSize: 12.5, color: '#991b1b', lineHeight: 1.55,
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{
            padding: '10px 12px',
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 10, marginBottom: 14,
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12.5, color: '#166534',
          }}>
            <CheckCircle2 size={15} /> Sharhingiz saqlandi! Rahmat.
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={saving || rating === 0}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: '13px',
            background: rating === 0 || saving ? '#94a3b8' : '#0f172a',
            color: '#fff', border: 'none', borderRadius: 12,
            fontSize: 14, fontWeight: 700,
            cursor: rating === 0 || saving ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            boxShadow: rating === 0 || saving ? 'none' : '0 4px 12px rgba(15,23,42,0.2)',
            transition: 'all 200ms',
          }}>
          {saving ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saqlanmoqda...</>
            : <><Send size={14} /> {existingReview ? "Yangilash" : "Sharhni jo'natish"}</>}
        </button>

        <p style={{
          fontSize: 11, color: '#94a3b8',
          textAlign: 'center', marginTop: 14, lineHeight: 1.55,
        }}>
          Sharhingiz boshqa mijozlarga to'g'ri yurist tanlashda yordam beradi
        </p>

        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  )
}
