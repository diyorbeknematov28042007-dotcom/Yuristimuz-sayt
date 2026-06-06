import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatPrice(from?: number, to?: number) {
  if (!from && !to) return "Kelishiladi"
  if (from && to) return `$${from} - $${to}`
  if (from) return `$${from} dan`
  return `$${to} gacha`
}
