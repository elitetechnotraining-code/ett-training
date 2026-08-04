import { useState } from 'react'
import Logo from './Logo'

const links = [
  { label: 'Courses', href: '#courses' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Enroll', href: '#enroll' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        <a href="#">
          <Logo size={42} />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#enroll"
            className="ml-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors">
            Get Started
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 text-gray-500 hover:text-brand-600" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          {open
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          }
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 flex flex-col gap-3">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-brand-600 py-1">
              {l.label}
            </a>
          ))}
          <a href="#enroll" onClick={() => setOpen(false)}
            className="mt-1 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold text-center">
            Get Started
          </a>
        </div>
      )}
    </header>
  )
}
