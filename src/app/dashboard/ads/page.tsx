import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatPrice, timeAgo } from '@/lib/utils'

export default async function AdsPage({
  searchParams,
}: {
  searchParams: { type?: string; spec?: string }
}) {
  const supabase = createClient()
  let query = supabase
    .from('ads')
    .select('*, profiles(full_name, role)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (searchParams.type) query = query.eq('role', searchParams.type)
  if (searchParams.spec) query = query.eq('specialization', searchParams.spec)

  const { data: ads } = await query

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Elonlar</h1>
        <Link href="/dashboard/ads/new" className="btn-primary text-sm">
          + Elon joylash
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'Barchasi', type: '' },
          { label: 'Mijozlar', type: 'client' },
          { label: 'Yuristlar', type: 'lawyer' },
        ].map((f) => (
          <Link key={f.type} href={f.type ? `?type=${f.type}` : '/dashboard/ads'}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              searchParams.type === f.type || (!searchParams.type && !f.type)
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {f.label}
          </Link>
        ))}
      </div>

      {/* Ads list */}
      <div className="space-y-3">
        {ads?.length === 0 && (
          <div className="card p-12 text-center text-gray-400">
            <p className="text-5xl mb-3">📭</p>
            <p className="font-medium">Elonlar topilmadi</p>
          </div>
        )}
        {ads?.map((ad) => (
          <Link key={ad.id} href={`/dashboard/ads/${ad.id}`}
            className="card p-5 block hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    ad.role === 'lawyer'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {ad.role === 'lawyer' ? '⚖️ Yurist' : '👤 Mijoz'}
                  </span>
                  <span className="text-xs text-gray-400">{timeAgo(ad.created_at)}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{ad.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2">{ad.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-400">📍 {ad.location || "Ko'rsatilmagan"}</span>
                  <span className="text-xs text-gray-400">🏷️ {ad.specialization}</span>
                  {(ad.price_from || ad.price_to) && (
                    <span className="text-xs font-medium text-green-600">
                      💰 {formatPrice(ad.price_from, ad.price_to)}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-400 flex-shrink-0">
                👁 {ad.views}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
