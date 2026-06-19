import Link from 'next/link'
import { Scale } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <header className="p-4">
        <Link href="/" className="flex items-center gap-2 w-fit" style={{ textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', letterSpacing: '-0.3px' }}>Yuristim</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}
