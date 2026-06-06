import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/layout/LogoutButton'
import {
  Scale, Home, FileText, Users, MessageCircle,
  User, Settings, Bell, ChevronDown
} from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  const isLawyer = profile?.role === 'lawyer'

  const navLinks = [
    { href: '/dashboard', label: 'Bosh sahifa', icon: <Home size={17} /> },
    { href: '/dashboard/ads', label: 'Elonlar', icon: <FileText size={17} /> },
    { href: '/dashboard/lawyers', label: 'Yuristlar', icon: <Scale size={17} /> },
    { href: '/dashboard/chat', label: 'Chat', icon: <MessageCircle size={17} />, badge: '3' },
    ...(isLawyer ? [
      { href: '/dashboard/profile', label: 'Profilim', icon: <User size={17} /> },
    ] : []),
    { href: '/dashboard/settings', label: 'Sozlamalar', icon: <Settings size={17} /> },
  ]

  const initials = profile?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex w-56 flex-shrink-0 flex-col bg-white border-r border-slate-100 fixed top-0 left-0 h-full z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-indigo rounded-lg flex items-center justify-center shadow-sm">
              <Scale size={15} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-900 text-sm tracking-tight">Yuristim</span>
              <span className="badge-beta ml-1.5 text-[10px] py-0">Beta</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              className="nav-link group relative">
              <span className="text-slate-400 group-[.active]:text-indigo-600">
                {link.icon}
              </span>
              <span className="flex-1">{link.label}</span>
              {link.badge && (
                <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-md">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="avatar-sm bg-indigo-100 text-indigo-700 text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{profile?.full_name}</p>
              <p className="text-[10px] text-slate-400">
                {isLawyer ? 'Yurist' : 'Mijoz'} · Free
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-5 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <Link href="/dashboard" className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-indigo rounded-lg flex items-center justify-center">
                <Scale size={13} className="text-white" />
              </div>
              <span className="font-bold text-slate-900 text-sm">Yuristim</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost btn-sm relative">
              <Bell size={17} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="avatar-sm bg-indigo-100 text-indigo-700 text-xs font-bold">
                {initials}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700">{profile?.full_name?.split(' ')[0]}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 pb-20 md:pb-5">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex z-40 px-2 pb-safe">
          {navLinks.slice(0, 4).map((link) => (
            <Link key={link.href} href={link.href}
              className="flex-1 flex flex-col items-center py-2.5 gap-1 text-slate-400 hover:text-indigo-600 transition-colors relative">
              {link.icon}
              <span className="text-[10px] font-medium">{link.label}</span>
              {link.badge && (
                <span className="absolute top-1.5 right-1/4 w-3.5 h-3.5 bg-indigo-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
