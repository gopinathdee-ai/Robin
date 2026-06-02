'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGaugeHigh, faComment, faBookmark, faUser, faBars, faXmark } from '@fortawesome/free-solid-svg-icons'

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
    { href: '/dashboard', icon: faGaugeHigh, label: 'Dashboard' },
    { href: '/community', icon: faComment, label: 'Community' },
    { href: '/saved', icon: faBookmark, label: 'Saved' },
    { href: '/profile', icon: faUser, label: 'Profile' },
  ]

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header className="border-b border-ink-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="Trades Platform" width={32} height={32} />
            <span className="font-bold text-lg text-ink-900 hidden sm:inline">Trades</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navItems.map(({ href, icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 text-sm font-semibold border-b-2 pb-1 transition-colors ${
                  isActive(href)
                    ? 'text-trades-600 border-trades-500'
                    : 'text-ink-600 border-transparent hover:text-ink-900'
                }`}
              >
                <FontAwesomeIcon icon={icon} className="h-4 w-4" />
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
              className="flex items-center justify-center px-2 py-2 bg-trades-500 text-white text-xs font-medium rounded-lg hover:bg-trades-600 transition-colors flex-shrink-0 whitespace-nowrap"
            >
              Ask
            </Link>
            <Link
              href="/community?create=post"
              className="flex items-center justify-center px-2 py-2 bg-trades-600 text-white text-xs font-medium rounded-lg hover:bg-trades-700 transition-colors flex-shrink-0 whitespace-nowrap"
            >
              Post
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-ink-600 hover:text-ink-900 transition-colors"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Slide Down from Header */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 md:hidden z-30"
            onClick={closeMenu}
            aria-hidden="true"
          />
          {/* Menu Panel - Compact, slides from header */}
          <nav className="fixed top-16 left-0 right-0 bg-white md:hidden z-40 border-b border-ink-200 shadow-lg">
            <div className="max-w-6xl mx-auto w-full px-4 py-3 space-y-1">
              {navItems.map(({ href, icon, label }) => (
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
                  <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </>
  )
}
