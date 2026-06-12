'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X, Loader2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Avatar from './Avatar'

type Props = {
  currentAvatarUrl?: string | null
  userName: string
  userId: string
  onUploadSuccess?: (newUrl: string | null) => void
}

const MAX_SIZE_MB = 2
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export default function AvatarUpload({
  currentAvatarUrl,
  userName,
  userId,
  onUploadSuccess,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─────────────────────────────────────
  // Rasm tanlash
  // ─────────────────────────────────────
  const handleFileSelect = async (file: File) => {
    setError('')
    setSuccess(false)

    // Validatsiya
    if (!file.type.startsWith('image/')) {
      setError("Faqat rasm fayllari qabul qilinadi (JPG, PNG, WebP)")
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`Rasm hajmi ${MAX_SIZE_MB}MB dan oshmasligi kerak`)
      return
    }

    // Preview
    const reader = new FileReader()
    reader.onload = (e) => setPreviewUrl(e.target?.result as string)
    reader.readAsDataURL(file)

    // Upload
    await uploadAvatar(file)
  }

  // ─────────────────────────────────────
  // Supabase Storage ga yuklash
  // ─────────────────────────────────────
  const uploadAvatar = async (file: File) => {
    setUploading(true)
    setError('')

    try {
      // Fayl nomi: userId + timestamp + extension
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      // Eski avatarni o'chirish (cleanup)
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/avatars/')[1]
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath])
        }
      }

      // Yangi avatarni yuklash
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        setError("Yuklashda xatolik: " + uploadError.message)
        setPreviewUrl(currentAvatarUrl || null)
        setUploading(false)
        return
      }

      // Public URL olish
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Database ga yozish
      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: publicUrl }),
      })

      if (!res.ok) {
        setError("Avatar saqlashda xato")
        setUploading(false)
        return
      }

      setPreviewUrl(publicUrl)
      setSuccess(true)
      onUploadSuccess?.(publicUrl)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error(err)
      setError("Texnik xato: " + (err.message || ''))
      setPreviewUrl(currentAvatarUrl || null)
    } finally {
      setUploading(false)
    }
  }

  // ─────────────────────────────────────
  // Avatarni o'chirish
  // ─────────────────────────────────────
  const handleRemove = async () => {
    if (!confirm("Avatar rasmini o'chirmoqchimisiz?")) return
    setUploading(true)
    setError('')

    try {
      // Storage dan o'chirish
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/avatars/')[1]
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath])
        }
      }

      // DB dan o'chirish
      await fetch('/api/user/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: null }),
      })

      setPreviewUrl(null)
      onUploadSuccess?.(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("O'chirishda xato")
    } finally {
      setUploading(false)
    }
  }

  // ─────────────────────────────────────
  // Drag & Drop handlers
  // ─────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
          e.target.value = '' // Reset
        }}
        style={{ display: 'none' }}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          display: 'flex', alignItems: 'center', gap: 18,
          padding: 18,
          background: dragActive ? '#eef2ff' : '#fafafa',
          border: dragActive ? '2px dashed #4338ca' : '0.5px solid #e2e8f0',
          borderRadius: 14,
          transition: 'all 200ms',
        }}>

        {/* Avatar preview */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Avatar
            src={previewUrl}
            name={userName}
            size={80}
            borderRadius={22}
            showRing
          />
          {uploading && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(15,23,42,0.6)', borderRadius: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Loader2 size={20} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          )}
        </div>

        {/* Info + Tugmalar */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            Profil rasmi
          </p>
          <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.5, marginBottom: 10 }}>
            JPG, PNG yoki WebP · max {MAX_SIZE_MB}MB
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 13px',
                background: '#0f172a', color: '#fff',
                border: 'none', borderRadius: 8,
                fontSize: 12, fontWeight: 600,
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: uploading ? 0.5 : 1,
              }}>
              <Camera size={12} /> {previewUrl ? "O'zgartirish" : "Yuklash"}
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 13px',
                  background: '#fff', color: '#991b1b',
                  border: '0.5px solid #fecaca', borderRadius: 8,
                  fontSize: 12, fontWeight: 600,
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  opacity: uploading ? 0.5 : 1,
                }}>
                <Trash2 size={12} /> O'chirish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status xabarlar */}
      {error && (
        <div style={{
          marginTop: 10, padding: '9px 13px',
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12.5, color: '#991b1b',
        }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
      {success && (
        <div style={{
          marginTop: 10, padding: '9px 13px',
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 12.5, color: '#166534',
        }}>
          <CheckCircle2 size={14} /> Avatar muvaffaqiyatli yangilandi
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
