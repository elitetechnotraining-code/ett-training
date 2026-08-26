import useDemoNotification from '../hooks/useDemoNotification'

export default function DemoOptions() {
  const { notifications } = useDemoNotification({ activeOnly: true, multiple: true })

  if (!notifications.length) return null

  return (
    <section id="demos" className="py-8 bg-gradient-to-b from-amber-50/70 to-white border-b border-amber-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-4">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-brand-700 bg-white border border-amber-200 rounded-full px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Currently Available Demos
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2">Choose a Demo and Enroll</h2>
          <p className="text-gray-500 mt-1 text-sm">Multiple demos can run at the same time. Pick your preferred slot and enroll directly.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notifications.map(item => {
            const rawHref = item.primaryCtaUrl || '/demo'
            const isInternalDemoLink = rawHref.startsWith('/demo')
            const href = isInternalDemoLink && item.id
              ? `/demo?demo=${item.id}`
              : rawHref
            return (
              <article key={item.id || `${item.title}-${item.date}-${item.time}`} className="rounded-2xl border border-gray-100 p-3.5 shadow-sm bg-gray-50">
                <span className="inline-block text-xs font-bold uppercase tracking-wide rounded-full bg-amber-300 text-gray-900 px-2.5 py-1">
                  {item.badge}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>

                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p>📅 {item.date}</p>
                  <p>🕖 {item.time}</p>
                  <p>💻 {item.mode}</p>
                  <p>💰 {item.fee}</p>
                </div>

                <a
                  href={href}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
                >
                  Enroll for this demo
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

