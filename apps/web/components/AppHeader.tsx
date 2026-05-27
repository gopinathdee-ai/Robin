'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Bookmark, User } from 'lucide-react'

export function AppHeader() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/community') return pathname.startsWith('/community')
    if (href === '/saved') return pathname.startsWith('/saved')
    if (href === '/profile') return pathname.startsWith('/profile')
    return false
  }

  return (
    <header className="border-b border-ink-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4 md:gap-8">
        {/* Logo */}
        <Link href="/community" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
          <Image src="/logo.png" alt="Trades Platform" width={32} height={32} />
          <span className="font-bold text-lg text-ink-900 hidden sm:inline">Trades</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 md:gap-8 flex-1 justify-center overflow-x-auto">
          <Link
            href="/dashboard"
            className={`flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold border-b-2 pb-1 transition-colors whitespace-nowrap ${
              isActive('/dashboard')
                ? 'text-trades-600 border-trades-500'
                : 'text-ink-600 border-transparent hover:text-ink-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link
            href="/community"
            className={`flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold border-b-2 pb-1 transition-colors whitespace-nowrap ${
              isActive('/community')
                ? 'text-trades-600 border-trades-500'
                : 'text-ink-600 border-transparent hover:text-ink-900'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Community</span>
          </Link>
          <Link
            href="/saved"
            className={`flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold border-b-2 pb-1 transition-colors whitespace-nowrap ${
              isActive('/saved')
                ? 'text-trades-600 border-trades-500'
                : 'text-ink-600 border-transparent hover:text-ink-900'
            }`}
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden md:inline">Saved</span>
          </Link>
          <Link
            href="/profile"
            className={`flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold border-b-2 pb-1 transition-colors whitespace-nowrap ${
              isActive('/profile')
                ? 'text-trades-600 border-trades-500'
                : 'text-ink-600 border-transparent hover:text-ink-900'
            }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </Link>
        </nav>

        {/* CTA */}
        <Link
          href="/community?create=true"
          className="flex items-center justify-center px-3 md:px-4 py-2 bg-trades-500 text-white text-xs md:text-sm font-medium rounded-lg hover:bg-trades-600 transition-colors flex-shrink-0 whitespace-nowrap"
        >
          <span className="hidden md:inline">Ask Question</span>
          <span className="md:hidden">+</span>
        </Link>
      </div>
    </header>
  )
}
