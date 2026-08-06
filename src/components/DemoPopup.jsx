import { useState, useEffect } from 'react'

export default function DemoPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show popup after 4 seconds, only once per session
    if (sessionStorage.getItem('demoPopupDismissed')) return
    const t = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    sessionStorage.setItem('demoPopupDismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-brand-700 to-indigo-600 px-6 py-4 text-white">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-gray-900 text-xs font-bold uppercase tracking-wide mb-2">
            Free Demo Class
          </span>
          <h2 className="text-xl font-extrabold leading-snug">
            Full-Stack Java + Angular + AI
          </h2>
          <p className="text-brand-200 text-sm mt-1">Live online session — absolutely free!</p>
        </div>

        {/* Details */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📅', label: 'Date', value: 'Sat, 9th Aug 2026' },
              { icon: '🕖', label: 'Time', value: '7:00 PM IST' },
              { icon: '💻', label: 'Mode', value: 'Online (Zoom)' },
              { icon: '💰', label: 'Fee', value: 'FREE' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase">{item.label}</p>
                  <p className="text-sm font-bold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <a href="/demo"
              onClick={dismiss}
              className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-center text-base hover:bg-brand-700 transition-colors shadow-md">
              🚀 Reserve My Free Seat
            </a>
            <button onClick={dismiss}
              className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              No thanks, I'll skip this
            </button>
          </div>
        </div>

        {/* Close button */}
        <button onClick={dismiss}
          className="absolute top-3 right-3 text-white/70 hover:text-white text-xl leading-none">
          ✕
        </button>
      </div>
    </div>
  )
}
