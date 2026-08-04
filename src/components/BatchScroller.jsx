const batches = [
  { course: 'AWS Solutions Architect',                date: 'Aug 12, 2026', time: '7:00 PM IST', seats: 8  },
  { course: 'SAP S/4HANA — Finance & Controlling',   date: 'Aug 15, 2026', time: '6:30 PM IST', seats: 5  },
  { course: 'Full-Stack Java — Spring Boot & Angular', date: 'Aug 18, 2026', time: '8:00 PM IST', seats: 12 },
  { course: 'SAP MM & SD Integration',                date: 'Aug 20, 2026', time: '7:00 PM IST', seats: 6  },
  { course: 'Apache Spark & Big Data Pipelines',      date: 'Aug 25, 2026', time: '6:00 PM IST', seats: 10 },
  { course: 'Docker, Kubernetes & CI/CD',             date: 'Sep 01, 2026', time: '8:00 PM IST', seats: 9  },
  { course: 'Machine Learning with Python',           date: 'Sep 05, 2026', time: '7:30 PM IST', seats: 7  },
  { course: 'Azure Data Engineering (DP-203)',        date: 'Sep 08, 2026', time: '6:30 PM IST', seats: 11 },
  { course: 'Python for Professionals',               date: 'Sep 10, 2026', time: '7:00 PM IST', seats: 15 },
]

const scrollStyle = `
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .marquee-track {
    display: flex;
    white-space: nowrap;
    animation: marquee 45s linear infinite;
  }
  .marquee-track:hover {
    animation-play-state: paused;
  }
`

export default function BatchScroller() {
  const items = [...batches, ...batches]

  return (
    <>
      <style>{scrollStyle}</style>
      <div
        style={{ top: '64px' }}
        className="sticky z-40 bg-brand-700 text-white py-2"
      >
        {/* Constrained to app width */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-3">

          {/* Badge */}
          <div className="flex-shrink-0">
            <span className="bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-wide shadow">
              🗓 New Batches
            </span>
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 w-px h-5 bg-brand-500" />

          {/* Scrolling ticker */}
          <div className="flex-1 overflow-hidden relative min-w-0">
            {/* Right fade — stops before the Enroll button */}
            <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-brand-700 to-transparent z-10 pointer-events-none" />

            <div className="marquee-track">
              {items.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm">
                  <span className="text-amber-300 font-semibold">{b.course}</span>
                  <span className="text-brand-400 mx-1">|</span>
                  <span className="text-white font-medium">{b.date}</span>
                  <span className="text-brand-300">&nbsp;{b.time}</span>
                  <span className="text-brand-400 mx-1">|</span>
                  <span className={`font-semibold ${b.seats <= 6 ? 'text-rose-300' : 'text-emerald-300'}`}>
                    {b.seats} seats left
                  </span>
                  <span className="text-brand-500 ml-4 text-xs">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 w-px h-5 bg-brand-500" />

          {/* Enroll button */}
          <a
            href="#enroll"
            className="flex-shrink-0 px-4 py-1.5 rounded-lg bg-amber-400 text-gray-900 text-xs font-bold uppercase tracking-wide hover:bg-amber-300 transition-colors shadow whitespace-nowrap"
          >
            Enroll Now →
          </a>
        </div>
      </div>
    </>
  )
}
