'use client'

import { useState, useEffect } from 'react'
import { Star, Edit3, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ReviewModal from './ReviewModal'

type Props = {
  lawyerId: string
  lawyerName: string
  clientId: string
  onReviewSaved?: () => void
}

export default function LeaveReviewButton({
  lawyerId,
  lawyerName,
  clientId,
  onReviewSaved,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [existingReview, setExistingReview] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkExistingReview()
  }, [lawyerId, clientId])

  const checkExistingReview = async () => {
    setLoading(true)
    const { data } = await supabase.rpc('get_my_review', {
      p_client_id: clientId,
      p_lawyer_id: lawyerId,
    })
    if (data && data.length > 0) {
      setExistingReview(data[0])
    } else {
      setExistingReview(null)
    }
    setLoading(false)
  }

  const handleSuccess = () => {
    checkExistingReview()
    onReviewSaved?.()
  }

  if (loading) {
    return (
      <button disabled style={btnStyle(true)}>
        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> ...
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </button>
    )
  }

  return (
    <>
      <button onClick={() => setModalOpen(true)} style={btnStyle(false, !!existingReview)}>
        {existingReview ? (
          <>
            <Edit3 size={13} /> Sharhni tahrirlash
          </>
        ) : (
          <>
            <Star size={13} /> Sharh qoldirish
          </>
        )}
      </button>

      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lawyerId={lawyerId}
        lawyerName={lawyerName}
        clientId={clientId}
        existingReview={existingReview}
        onSuccess={handleSuccess}
      />
    </>
  )
}

function btnStyle(loading: boolean, existing: boolean = false): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '10px 16px',
    background: existing ? '#fff' : '#f59e0b',
    color: existing ? '#0f172a' : '#fff',
    border: existing ? '1px solid #e2e8f0' : 'none',
    borderRadius: 11,
    fontSize: 13, fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    boxShadow: existing ? 'none' : '0 2px 8px rgba(245,158,11,0.25)',
    opacity: loading ? 0.6 : 1,
    transition: 'all 150ms',
  }
}
