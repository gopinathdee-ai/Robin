import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import { ToastProvider } from '@/components/ui/ToastContext'
import './globals.css'

const nunito = Nunito({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trades Platform — Your skills. Your record. Forever.',
  description:
    'Portable credentials and structured mentorship for Canada\'s skilled trades workers.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#c8511b',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${nunito.className} bg-white antialiased`} style={{ color: '#1a1007' }}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}