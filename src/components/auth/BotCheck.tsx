'use client'

import { useState, useMemo } from 'react'
import { CheckCircle2, X, Sparkles, RefreshCw, Scale } from 'lucide-react'
import { getRandomQuestion, QuizQuestion } from '@/lib/quiz-data'

type Props = {
  role: 'lawyer' | 'client'
  onSuccess: () => void
}

export function BotCheck({ role, onSuccess }: Props) {
  const [question, setQuestion] = useState<QuizQuestion>(() => getRandomQuestion(role))
  const [selected, setSelected] = useState<number | null>(null)
  const [verified, setVerified] = useState(false)

  // Role o'zgarsa savol ham yangilansin
  useMemo(() => {
    if (!verified) {
      setQuestion(getRandomQuestion(role))
      setSelected(null)
    }
  }, [role])

  const handleSelect = (idx: number) => {
    if (verified) return
    setSelected(idx)
    if (idx === question.correctIndex) {
      setTimeout(() => {
        setVerified(true)
        onSuccess()
      }, 600)
    }
  }

  const handleRetry = () => {
    setQuestion(getRandomQuestion(role))
    setSelected(null)
  }

  // ✅ Muvaffaqiyatli tasdiqlangan
  if (verified) {
    return (
      <div style={{
        padding: '14px 16px',
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        border: '1px solid #86efac',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{ width: 36, height: 36, background: '#22c55e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: '#166534', marginBottom: 2 }}>
            {role === 'lawyer'
              ? "Ajoyib! Siz bosh qomusimizdan habardorsiz"
              : "Ajoyib! Demak siz bot emassiz"}
          </p>
          <p style={{ fontSize: 11.5, color: '#15803d' }}>
            {role === 'lawyer' ? 'Marhamat, ro\'yxatdan o\'tishni davom ettiring' : 'Endi ro\'yxatdan o\'tishingiz mumkin'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: 16,
      background: '#fafafa',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, background: '#0f172a', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={13} color="#fff" strokeWidth={2.5} />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>Inson tekshiruvi</p>
            <p style={{ fontSize: 10, color: '#94a3b8' }}>
              {role === 'lawyer' ? 'Konstitutsiya bilimi' : 'Oddiy savol'}
            </p>
          </div>
        </div>
        <button type="button" onClick={handleRetry}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600 }}
          title="Boshqa savol">
          <RefreshCw size={12} />
        </button>
      </div>

      {/* Savol */}
      <div style={{
        background: '#fff',
        border: '0.5px solid #e2e8f0',
        borderRadius: 10,
        padding: '11px 14px',
        marginBottom: 10,
      }}>
        <p style={{ fontSize: 12.5, lineHeight: 1.6, color: '#0f172a', fontStyle: role === 'lawyer' ? 'normal' : 'normal' }}>
          {question.question}
        </p>
      </div>

      {/* Variantlar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {question.options.map((option, idx) => {
          const isSelected = selected === idx
          const isCorrect = isSelected && idx === question.correctIndex
          const isWrong = isSelected && idx !== question.correctIndex
          const letter = String.fromCharCode(65 + idx)

          return (
            <button key={idx} type="button" onClick={() => handleSelect(idx)} disabled={isWrong}
              style={{
                padding: '9px 12px',
                background: isCorrect ? '#f0fdf4' : isWrong ? '#fef2f2' : '#fff',
                border: `1px solid ${isCorrect ? '#86efac' : isWrong ? '#fca5a5' : '#e2e8f0'}`,
                borderRadius: 9,
                cursor: isWrong ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 200ms',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (selected === null) (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1' }}
              onMouseLeave={e => { if (selected === null) (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0' }}>

              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : '#fff',
                border: `1.5px solid ${isCorrect ? '#22c55e' : isWrong ? '#ef4444' : '#cbd5e1'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
                color: (isCorrect || isWrong) ? '#fff' : '#64748b',
                flexShrink: 0,
              }}>
                {isCorrect ? <CheckCircle2 size={11} /> : isWrong ? <X size={11} /> : letter}
              </div>

              <span style={{
                fontSize: 12.5,
                fontWeight: isCorrect || isWrong ? 600 : 500,
                color: isCorrect ? '#166534' : isWrong ? '#991b1b' : '#0f172a',
                flex: 1,
              }}>
                {option}
              </span>
            </button>
          )
        })}
      </div>

      {/* Xato xabari + retry */}
      {selected !== null && selected !== question.correctIndex && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#fef2f2', borderRadius: 8 }}>
          <p style={{ fontSize: 11.5, color: '#991b1b', fontWeight: 500 }}>
            Bu javob noto'g'ri. Qayta urinib ko'ring.
          </p>
          <button type="button" onClick={handleRetry}
            style={{ background: '#fff', border: '0.5px solid #fca5a5', color: '#991b1b', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={11} /> Yangi savol
          </button>
        </div>
      )}
    </div>
  )
}
