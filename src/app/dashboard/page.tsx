import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user!.id).single()

  const { data: recentAds } = await supabase
    .from('ads').select('*, profiles(full_name)')
    .eq('is_active', true).order('created_at', { ascending: false }).limit(5)

  const isLawyer = profile?.role === 'lawyer'

  return (
    <div className="space-y-6">
      {/* Salom */}
      <div className="card p-6">
        <h1 className="text-xl font-bold text-gray-900">
          Salom, {profile?.full_name}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isLawyer ? 'Yurist paneli' : 'Mijoz paneli'}
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: '/dashboard/ads/new', icon: '➕', label: 'Elon joylash', color: 'blue' },
          { href: '/dashboard/lawyers', icon: '⚖️', label: 'Yuristlar', color: 'green' },
          { href: '/dashboard/ads', icon: '📋', label: 'Barcha elonlar', color: 'purple' },
          { href: '/dashboard/chat', icon: '💬', label: 'Chatlar', color: 'orange' },
        ].map((action) => (
          <Link key={action.href} href={action.href}
            className="card p-4 text-center hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="text-sm font-medium text-gray-700">{action.label}</div>
          </Link>
        ))}
      </div>

      {/* Oxirgi elonlar */}
      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Yangi elonlar</h2>
          <Link href="/dashboard/ads" className="text-blue-600 text-sm hover:underline">Barchasi</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentAds?.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p>Hali elon yo'q</p>
            </div>
          )}
          {recentAds?.map((ad) => (
            <Link key={ad.id} href={`/dashboard/ads/${ad.id}`}
              className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">{ad.role === 'lawyer' ? '⚖️' : '👤'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{ad.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{ad.specialization} • {ad.location}</p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0">
                {ad.role === 'lawyer' ? 'Yurist' : 'Mijoz'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
