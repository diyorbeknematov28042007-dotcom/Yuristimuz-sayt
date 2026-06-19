// ════════════════════════════════════════════════
// ADMIN — Yangiliklar boshqaruvi (client)
// /src/app/admin/news/NewsManager.tsx
// ════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import { Newspaper, Plus, Edit2, Trash2, Eye, EyeOff, X, Loader2, CheckCircle2 } from 'lucide-react'

type News = {
  id: string
  title: string
  excerpt: string
  category: string
  cover_color: string
  is_published: boolean
  views_count: number
  created_by: string
  created_at: string
}

const CATEGORIES = ['Platforma', 'Huquq', "E'lon", 'Umumiy']
const COLORS = [
  { name: "Ko'k", val: '#4338ca' },
  { name: 'Yashil', val: '#166534' },
  { name: 'Qizil', val: '#b91c1c' },
  { name: 'Siyohrang', val: '#7e22ce' },
  { name: 'Tim qora', val: '#0f172a' },
  { name: "To'q sariq", val: '#c2410c' },
]

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function NewsManager({ initialNews }: { initialNews: News[] }) {
  const [news, setNews] = useState<News[]>(initialNews)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<News | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<News | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Forma maydonlari
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Umumiy')
  const [coverColor, setCoverColor] = useState('#4338ca')
  const [isPublished, setIsPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const refresh = async () => {
    const r = await fetch('/api/admin/news')
    const d = await r.json()
    if (d.news) setNews(d.news)
  }

  const openCreate = () => {
    setEditing(null)
    setTitle(''); setExcerpt(''); setContent('')
    setCategory('Umumiy'); setCoverColor('#4338ca'); setIsPublished(true)
    setErr(''); setShowForm(true)
  }

  const openEdit = (n: News) => {
    setEditing(n)
    setTitle(n.title); setExcerpt(n.excerpt || ''); setContent('')
    setCategory(n.category); setCoverColor(n.cover_color); setIsPublished(n.is_published)
    setErr(''); setShowForm(true)
    // To'liq matnni yuklash (ro'yxatda faqat excerpt bor)
    fetch(`/api/news/${n.id}`).then(r => r.json()).then(d => {
      if (d.news?.content) setContent(d.news.content)
    })
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setErr('Sarlavha va matn majburiy')
      return
    }
    setSaving(true); setErr('')
    const body = { title, excerpt, content, category, cover_color: coverColor, is_published: isPublished }
    try {
      const r = editing
        ? await fetch(`/api/admin/news/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await r.json()
      if (d.success || d.id) {
        setShowForm(false)
        await refresh()
      } else {
        setErr(d.error || 'Xatolik yuz berdi')
      }
    } catch (e: any) {
      setErr('Tarmoq xatosi')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteConfirm || deleting) return
    setDeleting(true)
    try {
      const r = await fetch(`/api/admin/news/${deleteConfirm.id}`, { method: 'DELETE' })
      const d = await r.json()
      if (d.success) {
        setNews(prev => prev.filter(n => n.id !== deleteConfirm.id))
        setDeleteConfirm(null)
      }
    } catch {}
    setDeleting(false)
  }

  const L: React.CSSProperties = { display: 'block', fontSize: 12.5, fontWeight: 600, color: '#475569', marginBottom: 6 }
  const I: React.CSSProperties = {
    width: '100%', padding: '10px 13px', fontSize: 14, background: '#fff',
    border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '8px 4px 40px' }}>
      {/* Sarlavha + yaratish tugmasi */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Newspaper size={22} color="#4338ca" />
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Yangiliklar</h1>
            <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 2 }}>{news.length} ta yangilik</p>
          </div>
        </div>
        <button onClick={openCreate}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 11, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Plus size={16} /> Yangi yangilik
        </button>
      </div>

      {/* Ro'yxat */}
      {news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', background: '#fff', borderRadius: 16, border: '0.5px solid #e2e8f0' }}>
          <Newspaper size={40} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14 }}>Hozircha yangilik yo'q. Birinchisini qo'shing.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {news.map(n => (
            <div key={n.id} style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 4, alignSelf: 'stretch', background: n.cover_color, borderRadius: 4, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: n.cover_color, background: `${n.cover_color}14`, padding: '2px 8px', borderRadius: 5 }}>{n.category}</span>
                  {n.is_published ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, color: '#16a34a', background: '#f0fdf4', padding: '2px 8px', borderRadius: 5 }}><Eye size={10} /> E'lon qilingan</span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: 5 }}><EyeOff size={10} /> Yashirilgan</span>
                  )}
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: '#94a3b8' }}>
                  <span>{fmtDate(n.created_at)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Eye size={11} /> {n.views_count}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => openEdit(n)} title="Tahrirlash"
                  style={{ width: 34, height: 34, background: '#f1f5f9', border: 'none', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Edit2 size={15} color="#475569" />
                </button>
                <button onClick={() => setDeleteConfirm(n)} title="O'chirish"
                  style={{ width: 34, height: 34, background: '#fef2f2', border: 'none', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Trash2 size={15} color="#dc2626" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yaratish/tahrirlash formasi (modal) */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: 20, overflowY: 'auto' }}
          onClick={e => { if (e.target === e.currentTarget && !saving) setShowForm(false) }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 24, width: '100%', maxWidth: 560, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', margin: 'auto 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>{editing ? 'Yangilikni tahrirlash' : 'Yangi yangilik'}</h2>
              <button onClick={() => !saving && setShowForm(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex' }}>
                <X size={16} color="#475569" />
              </button>
            </div>

            {err && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>{err}</div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={L}>Sarlavha *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} maxLength={200} placeholder="Yangilik sarlavhasi" style={I} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={L}>Qisqa tavsif</label>
              <input value={excerpt} onChange={e => setExcerpt(e.target.value)} maxLength={300} placeholder="Ro'yxatda ko'rinadigan qisqa matn" style={I} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={L}>To'liq matn *</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Yangilikning to'liq matni..." rows={8}
                style={{ ...I, resize: 'vertical', minHeight: 140, lineHeight: 1.6 }} />
            </div>

            <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={L}>Kategoriya</label>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...I, cursor: 'pointer' }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label style={L}>Rang</label>
                <select value={coverColor} onChange={e => setCoverColor(e.target.value)} style={{ ...I, cursor: 'pointer' }}>
                  {COLORS.map(c => <option key={c.val} value={c.val}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* E'lon holati */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, cursor: 'pointer' }}>
              <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#0f172a' }} />
              <span style={{ fontSize: 13.5, color: '#0f172a', fontWeight: 500 }}>Darhol e'lon qilish (foydalanuvchilar ko'radi)</span>
            </label>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowForm(false)} disabled={saving}
                style={{ flex: 1, padding: '12px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Bekor qilish
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ flex: 1, padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={15} />}
                {editing ? 'Saqlash' : "E'lon qilish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* O'chirish tasdiqlash */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget && !deleting) setDeleteConfirm(null) }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: 24, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width: 48, height: 48, background: '#fef2f2', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Trash2 size={22} color="#dc2626" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Yangilikni o'chirasizmi?</h3>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, marginBottom: 20 }}>
              «{deleteConfirm.title}» butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteConfirm(null)} disabled={deleting}
                style={{ flex: 1, padding: '12px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 11, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                Bekor qilish
              </button>
              <button onClick={handleDelete} disabled={deleting}
                style={{ flex: 1, padding: '12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 11, fontSize: 13.5, fontWeight: 700, cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.7 : 1, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                {deleting ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={15} />}
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
