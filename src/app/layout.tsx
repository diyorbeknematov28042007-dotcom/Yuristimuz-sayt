import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Yuristim — Huquqiy xizmatlar platformasi',
  description: "O'zbekistondagi birinchi huquqiy xizmatlar marketplace'i. Yurist toping, elon joylang.",
  keywords: 'yurist, advokat, huquqiy maslahat, uzbekistan, legaltech',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.variable}>
      <body className="font-inter">{children}</body>
    </html>
  )
}
