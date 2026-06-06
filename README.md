# LegalUZ MVP

O'zbekistondagi birinchi huquqiy xizmatlar marketplace'i.

## Tezkor Boshlash

### 1. Supabase Sozlash
1. [supabase.com](https://supabase.com) ga kiring → yangi loyiha yarating
2. SQL Editor ga o'ting → `supabase/schema.sql` faylini nusxalab ishga tushiring
3. Settings → API → URL va anon key ni ko'chiring

### 2. Environment Variables
`apps/web/.env.local.example` faylini ko'chiring:
```bash
cp apps/web/.env.local.example apps/web/.env.local
```
Keyin `.env.local` faylni oching va qiymatlarni to'ldiring:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Lokal Ishga Tushirish
```bash
cd apps/web
npm install
npm run dev
```
Browser: http://localhost:3000

### 4. Vercel Deploy
1. GitHub ga push qiling
2. [vercel.com](https://vercel.com) → Import repository
3. Environment variables qo'shing
4. Deploy!

## MVP Sahifalari
- `/` — Landing page
- `/auth/login` — Kirish
- `/auth/signup` — Ro'yxatdan o'tish
- `/dashboard` — Bosh sahifa
- `/dashboard/ads` — Elonlar
- `/dashboard/ads/new` — Elon joylash
- `/dashboard/lawyers` — Yuristlar
- `/dashboard/chat` — Chat

## Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime (chat)
- **Deploy:** Vercel (bepul)

## Keyingi Bosqichlar
- [ ] Yurist profil sahifasi
- [ ] Ad detail sahifasi
- [ ] Tarif va to'lov tizimi
- [ ] AI chatbot
- [ ] Yandex Maps
- [ ] Mobile (Expo)
