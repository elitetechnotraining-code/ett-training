import useDemoNotification from '../hooks/useDemoNotification'

const scrollStyle = `
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .marquee-track {
    display: flex;
    white-space: nowrap;
    animation: marquee 35s linear infinite;
  }
  .marquee-track:hover {
    animation-play-state: paused;
  }
`

export default function BatchScroller() {
  const { notifications } = useDemoNotification({ activeOnly: true, multiple: true })

  if (!notifications.length) return null

  const batches = notifications.map(item => ({
    rawCtaUrl: item.primaryCtaUrl || '/demo',
    id: item.id,
    course: item.title,
    date: item.date,
    time: item.time,
    mode: item.mode,
    ctaUrl: (item.primaryCtaUrl || '/demo').startsWith('/demo') && item.id
      ? `/demo?demo=${item.id}`
      : (item.primaryCtaUrl || '/demo'),
  }))

  const items = [...batches, ...batches, ...batches, ...batches]

  return (
    <>
      <style>{scrollStyle}</style>
      <div className="w-full bg-brand-700 text-white py-2">
        <div className="flex items-center gap-2 px-3 sm:px-6 sm:max-w-6xl sm:mx-auto">

          {/* Scrolling ticker */}
          <div className="flex-1 overflow-hidden relative min-w-0">
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-brand-700 to-transparent z-10 pointer-events-none" />
            <div className="marquee-track">
              {items.map((b, i) => (
                <a href={b.ctaUrl} key={`${b.id || b.course}-${i}`} className="inline-flex items-center gap-1.5 mx-6 text-xs sm:text-sm hover:opacity-90">
                  <span className="text-amber-300 font-semibold">{b.course}</span>
                  <span className="text-brand-400">|</span>
                  <span className="text-white font-medium">{b.date}</span>
                  <span className="text-brand-300">{b.time}</span>
                  <span className="text-brand-300">{b.mode}</span>
                  <span className="text-brand-500 ml-2 text-xs">✦</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
