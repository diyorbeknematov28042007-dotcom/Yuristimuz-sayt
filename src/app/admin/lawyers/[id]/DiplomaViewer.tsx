// ════════════════════════════════════════════════
// ADMIN — Diplom ko'rish (rasm yoki PDF)
// /src/app/admin/lawyers/[id]/DiplomaViewer.tsx
// ════════════════════════════════════════════════

'use client'
import { useState } from 'react'
import { Maximize2, Download, FileText, X } from 'lucide-react'

export default function DiplomaViewer({ url }: { url: string }) {
  const [fullscreen, setFullscreen] = useState(false)
  
  const isPdf = url.toLowerCase().endsWith('.pdf') || url.includes('application/pdf')
  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(url) || !isPdf

  return (
    <>
      <div style={{
        position: 'relative',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: 10,
        overflow: 'hidden',
      }}>
        {isImage && (
          <img
            src={url}
            alt="Diplom"
            style={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'contain',
              display: 'block',
              background: '#f1f5f9',
              cursor: 'zoom-in',
            }}
            onClick={() => setFullscreen(true)}
          />
        )}
        {isPdf && (
          <div style={{
            padding: 40,
            textAlign: 'center',
            background: '#f8fafc',
          }}>
            <FileText size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
              PDF formatdagi diplom
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                padding: '8px 14px',
                background: '#0f172a',
                color: '#fff',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: 'none',
              }}>
              PDF'ni ochish
            </a>
          </div>
        )}

        {/* Toolbar */}
        <div style={{
          position: 'absolute',
          top: 8, right: 8,
          display: 'flex',
          gap: 6,
        }}>
          {isImage && (
            <button
              onClick={() => setFullscreen(true)}
              title="Kattalashtirish"
              style={{
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: 6,
                cursor: 'pointer',
                display: 'flex',
              }}>
              <Maximize2 size={13} />
            </button>
          )}
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            title="Yuklab olish"
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: 6,
              cursor: 'pointer',
              display: 'flex',
              textDecoration: 'none',
            }}>
            <Download size={13} />
          </a>
        </div>
      </div>

      {/* Fullscreen modal */}
      {fullscreen && isImage && (
        <div
          onClick={() => setFullscreen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            cursor: 'zoom-out',
          }}>
          <button
            onClick={() => setFullscreen(false)}
            style={{
              position: 'absolute',
              top: 16, right: 16,
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: 10,
              cursor: 'pointer',
              display: 'flex',
            }}>
            <X size={18} />
          </button>
          <img
            src={url}
            alt="Diplom"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </>
  )
}
