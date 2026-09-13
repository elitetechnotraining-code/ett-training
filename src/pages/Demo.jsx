import { useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import Logo from '../components/Logo'
import CountdownTimer from '../components/CountdownTimer'
import WhatsAppButton from '../components/WhatsAppButton'
import useDemoNotification, { defaultDemoNotification } from '../hooks/useDemoNotification'

const INITIAL = { name: '', email: '', phone: '', experience: '' }

function buildDemoUrl(demoId) {
  const origin = window.location.origin || 'https://elitetechsolutions.co.in'
  return `${origin}/demo${demoId ? `?demo=${demoId}` : ''}`
}

function formatNotificationMessage(status) {
  if (!status) return ''

  const adminDelivered = status?.notifications?.admin?.delivered
  const userDelivered = status?.notifications?.user?.delivered
  const adminAttempted = status?.notifications?.admin?.attempted
  const userAttempted = status?.notifications?.user?.attempted

  if (adminDelivered && userDelivered) {
    return 'WhatsApp confirmations were sent to both you and our team.'
  }

  if (userDelivered && !adminDelivered && adminAttempted) {
    return 'Your WhatsApp confirmation was sent. Our team notification is pending.'
  }

  if (adminDelivered && !userDelivered && userAttempted) {
    return 'Our team was notified on WhatsApp. Your confirmation message is pending.'
  }

  if (adminAttempted || userAttempted) {
    return 'Your registration was saved, but WhatsApp delivery is still pending. We will follow up shortly.'
  }

  return 'Your registration was saved successfully. WhatsApp auto-confirmation is not configured yet.'
}

export default function Demo() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const [notificationStatus, setNotificationStatus] = useState(null)
  const { notifications } = useDemoNotification({ activeOnly: true, multiple: true })
  const selectedDemoId = new URLSearchParams(window.location.search).get('demo')

  const selectedDemo = useMemo(() => {
    if (selectedDemoId && notifications.length) {
      const match = notifications.find(item => item.id === selectedDemoId)
      if (match) return match
    }
    return notifications[0] || defaultDemoNotification
  }, [notifications, selectedDemoId])

  const demoUrl = buildDemoUrl(selectedDemo.id)
  const eventLine = `${selectedDemo.date} at ${selectedDemo.time}`
  const shareMessage = `Join me for ${selectedDemo.badge}: ${selectedDemo.title}! 🚀\n📅 ${selectedDemo.date}, ${selectedDemo.time}\n👉 Register here: ${demoUrl}`
  const tweetMessage = `🚀 ${selectedDemo.badge}: ${selectedDemo.title}\n📅 ${selectedDemo.date}, ${selectedDemo.time}\n👉 Register here: ${demoUrl}\n#FullStackJava #Angular #AI #FreeDemoClass`

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.phone.trim()) e.phone = 'Phone number is required.'
    if (!form.experience) e.experience = 'Please select your experience level.'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setLoading(true)
    setServerError('')
    setNotificationStatus(null)
    const modernPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      experience: form.experience,
      demo_id: selectedDemo.id || null,
      demo_title: selectedDemo.title,
    }

    // Backward compatibility: retry with legacy payload if new columns are not present yet.
    let { error } = await supabase.from('demo_registrations').insert([modernPayload])

    if (error) {
      const legacyPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        experience: `${form.experience} | Demo: ${selectedDemo.title} (${selectedDemo.date}, ${selectedDemo.time})`,
      }
      const { error: legacyError } = await supabase.from('demo_registrations').insert([legacyPayload])
      error = legacyError
    }

    if (error) {
      setLoading(false)
      setServerError('Something went wrong. Please try again or WhatsApp us at +91 90595 71845.')
      return
    }

    try {
      const response = await fetch('/api/demo-registration-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            experience: form.experience,
          },
          demo: {
            id: selectedDemo.id || null,
            badge: selectedDemo.badge,
            title: selectedDemo.title,
            subtitle: selectedDemo.subtitle,
            date: selectedDemo.date,
            time: selectedDemo.time,
            mode: selectedDemo.mode,
            fee: selectedDemo.fee,
            url: demoUrl,
          },
        }),
      })

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        setNotificationStatus({
          ok: false,
          message: payload?.error || 'Registration saved, but WhatsApp notifications could not be sent automatically.',
          notifications: payload?.notifications,
        })
      } else {
        setNotificationStatus({
          ok: payload?.ok ?? true,
          message: formatNotificationMessage(payload),
          notifications: payload?.notifications,
        })
      }
    } catch {
      setNotificationStatus({
        ok: false,
        message: 'Registration saved, but WhatsApp notifications could not be sent automatically.',
      })
    }

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-brand-700 to-indigo-900">
      {/* Navbar */}
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <a href="/"><Logo size={40} /></a>
        <a href="/#enroll"
          className="text-sm font-semibold text-white border border-white/30 px-4 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
          Enroll Now
        </a>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-2 gap-12 items-start">

        {/* Left — Event details */}
        <div className="text-white flex flex-col gap-6">
          <span className="inline-block w-fit px-4 py-1.5 rounded-full bg-amber-400 text-gray-900 text-xs font-bold uppercase tracking-widest">
            {selectedDemo.badge}
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            {selectedDemo.title}
          </h1>

          <p className="text-brand-200 text-lg leading-relaxed">
            {selectedDemo.subtitle}
          </p>

          {/* Event meta */}
          <div className="flex flex-col gap-3">
            {[
              { icon: '📅', label: 'Date', value: selectedDemo.date },
              { icon: '🕖', label: 'Time', value: selectedDemo.time },
              { icon: '💻', label: 'Mode', value: selectedDemo.mode },
              { icon: '💰', label: 'Fee', value: selectedDemo.fee },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-brand-300 text-xs font-semibold uppercase tracking-wide">{item.label}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Countdown timer */}
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur">
            <CountdownTimer />
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4 backdrop-blur">
            <div className="flex -space-x-2">
              {['bg-violet-400','bg-sky-400','bg-emerald-400','bg-amber-400','bg-rose-400'].map((c,i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-brand-700 flex items-center justify-center text-white text-xs font-bold`}>
                  {['A','R','S','M','P'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">120+ already registered</p>
              <p className="text-brand-300 text-xs">Join them — seats are limited!</p>
            </div>
          </div>

          {/* What you'll learn */}
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur">
            <p className="font-bold text-white mb-3">What You'll Learn in the Demo</p>
            <ul className="space-y-2">
              {[
                'Overview of Full-Stack Java roadmap',
                'How Spring Boot powers enterprise backends',
                'Building dynamic UIs with Angular',
                'Integrating AI features using Spring AI & OpenAI',
                'Career opportunities & salary trends',
                'Live Q&A with the instructor',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-brand-100">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Social share */}
          <div className="flex flex-col gap-2">
            <p className="text-brand-300 text-sm font-semibold">Share with friends:</p>
            <div className="flex flex-wrap gap-2">
              {/* WhatsApp */}
              <a href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-semibold transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              {/* LinkedIn */}
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://elitetechsolutions.co.in/demo')}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
              {/* Twitter / X */}
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetMessage)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black hover:bg-gray-800 text-white text-xs font-semibold transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X (Twitter)
              </a>
              {/* Facebook */}
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://elitetechsolutions.co.in/demo')}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
              {/* Telegram */}
              <a href={`https://t.me/share/url?url=${encodeURIComponent(`https://elitetechsolutions.co.in/demo${selectedDemo.id ? `?demo=${selectedDemo.id}` : ''}`)}&text=${encodeURIComponent(`${selectedDemo.badge}: ${selectedDemo.title}\n📅 ${selectedDemo.date}, ${selectedDemo.time} — Register now!`)}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                Telegram
              </a>
              {/* Instagram — copy link only (no direct share API) */}
              <button
                onClick={() => { navigator.clipboard.writeText('https://elitetechsolutions.co.in/demo'); alert('Link copied! Paste it in your Instagram bio or story.') }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-semibold transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                Instagram
              </button>
            </div>
          </div>
        </div>

        {/* Right — Registration form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {submitted ? (
            <div className="text-center py-6 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl">✓</div>
              <h2 className="text-2xl font-bold text-gray-900">You're Registered!</h2>
              <p className="text-gray-500">Thanks, <strong>{form.name}</strong>! We'll send the Zoom link to <strong>{form.email}</strong> and WhatsApp you at <strong>{form.phone}</strong> before the demo.</p>
              <div className="w-full bg-brand-50 rounded-xl p-4 text-sm text-brand-700 font-medium text-center">
                📅 {selectedDemo.title} - {eventLine}
              </div>
              {notificationStatus?.message && (
                <div className={`w-full rounded-xl p-4 text-sm text-center ${notificationStatus.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {notificationStatus.message}
                </div>
              )}
              {notificationStatus?.notifications?.user && !notificationStatus.notifications.user.delivered && (
                <a
                  href={`https://wa.me/919059571845?text=${encodeURIComponent(`Hi, I registered for ${selectedDemo.title} on ${selectedDemo.date} at ${selectedDemo.time}. Please share the confirmation details.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors"
                >
                  Open WhatsApp fallback
                </a>
              )}
              <a href="/"
                className="mt-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors">
                Back to Home
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Enroll for This Demo</h2>
              <p className="text-gray-500 text-sm mb-2">Limited seats available. Register now to confirm your spot.</p>
              <p className="text-sm font-semibold text-brand-700 mb-6">Selected Demo: {selectedDemo.title} - {selectedDemo.date}, {selectedDemo.time}</p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Full Name <span className="text-rose-500">*</span></label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith"
                    className={`rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 ${errors.name ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`} />
                  {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Email Address <span className="text-rose-500">*</span></label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com"
                    className={`rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 ${errors.email ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`} />
                  {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">WhatsApp Number <span className="text-rose-500">*</span></label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"
                    className={`rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 ${errors.phone ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`} />
                  {errors.phone && <p className="text-xs text-rose-500">{errors.phone}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Experience Level <span className="text-rose-500">*</span></label>
                  <select name="experience" value={form.experience} onChange={handleChange}
                    className={`rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 bg-white ${errors.experience ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`}>
                    <option value="">Select your level…</option>
                    <option value="Fresher (0 years)">Fresher (0 years)</option>
                    <option value="Junior (1-2 years)">Junior (1–2 years)</option>
                    <option value="Mid-level (3-5 years)">Mid-level (3–5 years)</option>
                    <option value="Senior (5+ years)">Senior (5+ years)</option>
                  </select>
                  {errors.experience && <p className="text-xs text-rose-500">{errors.experience}</p>}
                </div>

                {serverError && <p className="text-sm text-rose-500 text-center">{serverError}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-base hover:bg-brand-700 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? 'Registering…' : '🚀 Register for Demo'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By registering you agree to be contacted via WhatsApp & email about this demo.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
      <WhatsAppButton />
    </div>
  )
}
