import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { SPECIALIZATIONS } from '@/lib/types'

export default async function LawyersPage({
  searchParams,
}: { searchParams: { spec?: string; location?: string } }) {
  const supabase = createClient()

  let query = supabase
    .from('lawyer_profiles')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_available', true)
    .order('rating', { ascending: false })

  if (searchParams.spec) query = query.contains('specialization', [searchParams.spec])
  if (searchParams.location) query = query.eq('location', searchParams.location)

  const { data: lawyers } = await query

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Yuristlar</h1>

      {/* Filtrlar */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/lawyers"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              !searchParams.spec ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            Barchasi
          </Link>
          {SPECIALIZATIONS.slice(0, 6).map(s => (
            <Link key={s} href={`?spec=${encodeURIComponent(s)}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                searchParams.spec === s ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Lawyers grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {lawyers?.length === 0 && (
          <div className="col-span-2 card p-12 text-center text-gray-400">
            <p className="text-5xl mb-3">⚖️</p>
            <p>Yuristlar topilmadi</p>
          </div>
        )}
        {lawyers?.map((lawyer) => (
          <Link key={lawyer.id} href={`/dashboard/lawyers/${lawyer.id}`}
            className="card p-5 hover:shadow-md transition-shadow block">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-lg font-bold">
                  {(lawyer as any).profiles?.full_name?.[0] || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {(lawyer as any).profiles?.full_name}
                  </h3>
                  {lawyer.is_verified && (
                    <span className="text-blue-500 text-sm">✓</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="text-sm text-gray-600">{lawyer.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({lawyer.reviews_count} sharh)</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {lawyer.specialization.slice(0, 2).map((s: string) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  {lawyer.location && <span>📍 {lawyer.location}</span>}
                  <span>💼 {lawyer.experience_years} yil</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
