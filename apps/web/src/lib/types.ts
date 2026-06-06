export type UserRole = 'client' | 'lawyer'
export type Tariff = 'free' | 'pro' | 'pro_plus' | 'enterprise'
export type AdRole = 'client' | 'lawyer'
export type ConversationStatus = 'active' | 'closed'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface LawyerProfile {
  id: string
  specialization: string[]
  experience_years: number
  location?: string
  bio?: string
  rating: number
  reviews_count: number
  is_verified: boolean
  is_available: boolean
  tariff: Tariff
  credits: number
  created_at: string
  profiles?: Profile
}

export interface Ad {
  id: string
  user_id: string
  role: AdRole
  title: string
  description: string
  specialization: string
  location?: string
  price_from?: number
  price_to?: number
  is_active: boolean
  views: number
  created_at: string
  expires_at: string
  profiles?: Profile
}

export interface Conversation {
  id: string
  client_id: string
  lawyer_id: string
  ad_id?: string
  status: ConversationStatus
  last_message?: string
  last_message_at: string
  created_at: string
  client?: Profile
  lawyer?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
  profiles?: Profile
}

export const SPECIALIZATIONS = [
  'Fuqarolik huquqi',
  'Jinoyat huquqi',
  'Mehnat huquqi',
  'Oilaviy huquq',
  'Korporativ huquq',
  'Mulk huquqi',
  'Soliq huquqi',
  'Intellektual mulk',
  'Migratsiya huquqi',
  'Boshqa',
] as const

export const LOCATIONS = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand',
  'Buxoro',
  'Andijon',
  'Namangan',
  'Farg\'ona',
  'Qashqadaryo',
  'Surxondaryo',
  'Xorazm',
  'Navoiy',
  'Jizzax',
  'Sirdaryo',
  'Qoraqalpog\'iston',
] as const
