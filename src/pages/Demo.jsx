import { useState } from 'react'
import { supabase } from '../supabaseClient'
import Logo from '../components/Logo'

const INITIAL = { name: '', email: '', phone: '', experience: '' }

export default function Demo() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

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
    const { error } = await supabase.from('demo_registrations').insert([{
      name:       form.name.trim(),
      email:      form.email.trim(),
      phone:      form.phone.trim(),
      experience: form.experience,
    }])
    setLoading(false)
    if (error) { setServerError('Something went wrong. Please try again or WhatsApp us at +91 90595 71845.'); return }
    setSubmitted(true)
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
            Free Demo Class
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            Full-Stack Java<br />
            <span className="text-amber-300">Spring Boot, Angular</span><br />
            & AI Integration
          </h1>

          <p className="text-brand-200 text-lg leading-relaxed">
            Join our free live demo and discover how to build enterprise-grade, AI-powered web applications from scratch. Taught by industry practitioners with real project experience.
          </p>

          {/* Event meta */}
          <div className="flex flex-col gap-3">
            {[
              { icon: '📅', label: 'Date', value: 'Saturday, 9th August 2026' },
              { icon: '🕖', label: 'Time', value: '7:00 PM IST' },
              { icon: '💻', label: 'Mode', value: 'Online (Zoom — link sent after registration)' },
              { icon: '💰', label: 'Fee', value: 'Absolutely FREE' },
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
            <div className="flex gap-3">
              <a href={`https://wa.me/?text=${encodeURIComponent('Join me for a FREE Full-Stack Java + AI demo class by Elite Tech Solutions! 🚀\n📅 9th August 2026, 7:00 PM IST\n👉 Register here: https://elitetechsolutions.co.in/demo')}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors">
                📱 WhatsApp
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://elitetechsolutions.co.in/demo')}`}
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                💼 LinkedIn
              </a>
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
                📅 Saturday, 9th August 2026 at 7:00 PM IST
              </div>
              <a href="/"
                className="mt-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors">
                Back to Home
              </a>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Reserve Your Free Seat</h2>
              <p className="text-gray-500 text-sm mb-6">Limited seats available. Register now to confirm your spot.</p>

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
                  {loading ? 'Registering…' : '🚀 Register for Free Demo'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  By registering you agree to be contacted via WhatsApp & email about this demo.
                </p>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
