'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, MessageSquare, Bookmark, User, Menu, X } from 'lucide-react'

export function AppHeader() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/community') return pathname.startsWith('/community')
    if (href === '/saved') return pathname.startsWith('/saved')
    if (href === '/profile') return pathname.startsWith('/profile')
    return false
  }

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/community', icon: MessageSquare, label: 'Community' },
    { href: '/saved', icon: Bookmark, label: 'Saved' },
    { href: '/profile', icon: User, label: 'Profile' },
  ]

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header className="border-b border-ink-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/community" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="Trades Platform" width={32} height={32} />
            <span className="font-bold text-lg text-ink-900 hidden sm:inline">Trades</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 text-sm font-semibold border-b-2 pb-1 transition-colors ${
                  isActive(href)
                    ? 'text-trades-600 border-trades-500'
                    : 'text-ink-600 border-transparent hover:text-ink-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Link
              href="/community?create=question"
              className="flex items-center justify-center px-4 py-2 bg-trades-500 text-white text-sm font-medium rounded-lg hover:bg-trades-600 transition-colors whitespace-nowrap"
            >
              Ask Question
            </Link>
            <Link
              href="/community?create=post"
              className="flex items-center justify-center px-4 py-2 bg-trades-600 text-white text-sm font-medium rounded-lg hover:bg-trades-700 transition-colors whitespace-nowrap"
            >
              Create Post
            </Link>
          </div>

          {/* Mobile CTA + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/community?create=question"
              className="flex items-center justify-center px-3 py-2 bg-trades-500 text-white text-sm font-medium rounded-lg hover:bg-trades-600 transition-colors flex-shrink-0"
              title="Ask Question"
            >
              Q
            </Link>
            <Link
              href="/community?create=post"
              className="flex items-center justify-center px-3 py-2 bg-trades-600 text-white text-sm font-medium rounded-lg hover:bg-trades-700 transition-colors flex-shrink-0"
              title="Create Post"
            >
              P
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-ink-600 hover:text-ink-900 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-ink-200 bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-4 space-y-2">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  isActive(href)
                    ? 'text-trades-600 bg-trades-50'
                    : 'text-ink-700 hover:bg-ink-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}
