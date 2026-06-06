import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Yuristim — Huquqiy xizmatlar platformasi',
  description: "O'zbekistondagi birinchi huquqiy xizmatlar marketplace'i",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  )
}
