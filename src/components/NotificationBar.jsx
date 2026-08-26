import useDemoNotification from '../hooks/useDemoNotification'

export default function NotificationBar() {
  const { notifications } = useDemoNotification({ activeOnly: true, multiple: true })

  if (!notifications.length) return null

  return (
    <section className="border-b bg-amber-50 text-amber-900 border-amber-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex gap-2 overflow-x-auto">
          {notifications.map((notification, index) => (
            <a
              key={`${notification.title}-${notification.date}-${index}`}
              href={notification.primaryCtaUrl || '/demo'}
              className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white/70 px-3 py-1.5 text-xs sm:text-sm hover:bg-white transition-colors"
            >
              <span className="font-bold">{notification.badge}</span>
              <span className="text-amber-700">{notification.title}</span>
              <span className="text-amber-500">|</span>
              <span>{notification.date}</span>
              <span>{notification.time}</span>
              <span>{notification.mode}</span>
              <span className="font-semibold">{notification.fee}</span>
              {notification.primaryCtaLabel && (
                <span className="font-semibold underline underline-offset-2">{notification.primaryCtaLabel}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

