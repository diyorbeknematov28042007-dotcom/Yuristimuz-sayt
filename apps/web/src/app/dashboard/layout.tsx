import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/layout/LogoutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const isLawyer = profile?.role === 'lawyer'

  const navLinks = [
    { href: '/dashboard', label: 'Bosh sahifa', icon: '🏠' },
    { href: '/dashboard/ads', label: 'Elonlar', icon: '📋' },
    { href: '/dashboard/lawyers', label: 'Yuristlar', icon: '⚖️' },
    { href: '/dashboard/chat', label: 'Chat', icon: '💬' },
    ...(isLawyer ? [{ href: '/dashboard/profile', label: 'Profil', icon: '👤' }] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="font-bold text-gray-900">LegalUZ</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{profile?.full_name}</span>
            {isLawyer && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                Yurist
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-48 flex-shrink-0 hidden md:block">
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm">
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex">
        {navLinks.slice(0, 4).map((link) => (
          <Link key={link.href} href={link.href}
            className="flex-1 flex flex-col items-center py-2 text-gray-500 hover:text-blue-600 text-xs gap-1">
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
