import Link from 'next/link'
import { Scale } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-5">
        <Link href="/" className="flex items-center gap-2.5 w-fit group">
          <div className="w-8 h-8 bg-gradient-indigo rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-indigo transition-shadow">
            <Scale size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">Yuristim</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
      <footer className="p-5 text-center">
        <p className="text-xs text-slate-400">© 2026 Yuristim. Barcha huquqlar himoyalangan.</p>
      </footer>
    </div>
  )
}
