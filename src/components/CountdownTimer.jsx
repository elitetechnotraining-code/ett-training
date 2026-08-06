import { useState, useEffect } from 'react'

const DEMO_DATE = new Date('2026-08-15T13:30:00Z') // 7:00 PM IST = 13:30 UTC

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const diff = DEMO_DATE - Date.now()
    if (diff <= 0) return null
    const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)
    return { days, hours, minutes, seconds }
  }

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!timeLeft) {
    return (
      <div className="bg-emerald-500 text-white text-center py-3 px-4 rounded-2xl font-bold text-lg">
        🎉 The demo is live now! Join immediately.
      </div>
    )
  }

  const units = [
    { label: 'Days',    value: timeLeft.days },
    { label: 'Hours',   value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-brand-700 font-semibold text-sm uppercase tracking-widest">Demo starts in</p>
      <div className="flex gap-3">
        {units.map(u => (
          <div key={u.label} className="flex flex-col items-center bg-brand-600 text-white rounded-xl px-4 py-3 min-w-[64px]">
            <span className="text-2xl font-extrabold tabular-nums">{pad(u.value)}</span>
            <span className="text-xs text-brand-200 font-medium mt-0.5">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
