// ════════════════════════════════════════════════
// E'LON KONSTANTALARI (markazlashtirilgan)
// /src/lib/ads-constants.ts
// ════════════════════════════════════════════════

// Kategoriyalar — Migratsiya OLIB TASHLANDI (audit C3)
export const AD_CATEGORIES = [
  'Oilaviy',
  'Biznes',
  'Mulk',
  'Mehnat',
  'Soliq',
  'Jinoyat',
  'Shartnoma',
] as const

// Hududlar (audit C4): Toshkent sh., Qo'qon sh., 12 viloyat,
// Qoraqalpog'iston Resp., Respublika bo'ylab
export const AD_REGIONS = [
  'Toshkent shahri',
  "Qo'qon shahri",
  'Toshkent viloyati',
  'Andijon',
  'Buxoro',
  "Farg'ona",
  'Jizzax',
  'Xorazm',
  'Namangan',
  'Navoiy',
  'Qashqadaryo',
  'Samarqand',
  'Sirdaryo',
  'Surxondaryo',
  "Qoraqalpog'iston Respublikasi",
  "Respublika bo'ylab",
] as const

export type AdCategory = typeof AD_CATEGORIES[number]
export type AdRegion = typeof AD_REGIONS[number]

// Maksimal kategoriya tanlash (audit C6)
export const MAX_AD_CATEGORIES = 4

// Narxni formatlash: 100000 -> "100 000"
export function formatPrice(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return ''
  return num.toLocaleString('uz-UZ').replace(/,/g, ' ')
}

// Sana formatlash: ISO -> "09.06.2026"
export function formatAdDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
