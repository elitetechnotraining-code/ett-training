const batches = [
  { course: 'Full-Stack Java — Spring Boot, Angular & AI', date: 'Aug 9, 2026', time: '7:00 PM IST' },
]

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
  const items = [...batches, ...batches, ...batches, ...batches]

  return (
    <>
      <style>{scrollStyle}</style>
      {/* Sits in normal flow just below the fixed navbar — mt-16 pushes it below the 64px navbar */}
      <div className="w-full bg-brand-700 text-white py-2 mt-16">
        <div className="flex items-center gap-2 px-3 sm:px-6 sm:max-w-6xl sm:mx-auto">

          {/* Scrolling ticker */}
          <div className="flex-1 overflow-hidden relative min-w-0">
            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-brand-700 to-transparent z-10 pointer-events-none" />
            <div className="marquee-track">
              {items.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 mx-6 text-xs sm:text-sm">
                  <span className="text-amber-300 font-semibold">{b.course}</span>
                  <span className="text-brand-400">|</span>
                  <span className="text-white font-medium">{b.date}</span>
                  <span className="text-brand-300">{b.time}</span>
                  <span className="text-brand-500 ml-2 text-xs">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 w-px h-4 bg-brand-500" />

          {/* Enroll button */}
          <a
            href="#enroll"
            className="flex-shrink-0 px-3 py-1 rounded-lg bg-amber-400 text-gray-900 text-xs font-bold uppercase tracking-wide hover:bg-amber-300 transition-colors shadow whitespace-nowrap"
          >
            Enroll →
          </a>
        </div>
      </div>
    </>
  )
}
