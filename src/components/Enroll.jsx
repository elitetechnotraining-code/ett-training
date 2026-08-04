import { useState } from 'react'
import { supabase } from '../supabaseClient'

const courses = [
  'AWS Solutions Architect',
  'SAP S/4HANA — Finance & Controlling',
  'SAP MM & SD Integration',
  'Apache Spark & Big Data Pipelines',
  'Full-Stack Java — Spring Boot & Angular',
  'Docker, Kubernetes & CI/CD',
  'Machine Learning with Python',
  'Azure Data Engineering (DP-203)',
  'Python for Professionals',
]

const INITIAL = { name: '', email: '', phone: '', course: '', message: '' }

export default function Enroll() {
  const [form, setForm] = useState(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.'
    if (!form.course) e.course = 'Please select a course.'
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

    const { error } = await supabase.from('enrollments').insert([{
      name:    form.name.trim(),
      email:   form.email.trim(),
      phone:   form.phone.trim() || null,
      course:  form.course,
      message: form.message.trim() || null,
    }])

    setLoading(false)

    if (error) {
      setServerError('Something went wrong. Please try again or contact us directly.')
      return
    }

    setSubmitted(true)
  }

  return (
    <section id="enroll" className="py-20 bg-gradient-to-br from-brand-600 to-brand-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mt-3 text-brand-200 text-lg">
            Fill out the form and an advisor will reach out within one business day.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
            <h3 className="text-xl font-bold text-gray-900">Enrollment Request Received!</h3>
            <p className="mt-2 text-gray-500">Thanks, {form.name}. We'll contact you at <strong>{form.email}</strong> shortly.</p>
            <button onClick={() => { setForm(INITIAL); setSubmitted(false) }}
              className="mt-6 px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:border-brand-400 hover:text-brand-600 transition-colors">
              Submit another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate
            className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Full name */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Full Name <span className="text-rose-500">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith"
                className={`rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-200 ${errors.name ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`} />
              {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Email Address <span className="text-rose-500">*</span></label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com"
                className={`rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-200 ${errors.email ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`} />
              {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-200 focus:border-brand-400" />
            </div>

            {/* Course selector */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Course <span className="text-rose-500">*</span></label>
              <select name="course" value={form.course} onChange={handleChange}
                className={`rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-200 bg-white ${errors.course ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`}>
                <option value="">Select a course…</option>
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.course && <p className="text-xs text-rose-500">{errors.course}</p>}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Message <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea name="message" rows={4} value={form.message} onChange={handleChange}
                placeholder="Tell us about your background or any questions you have…"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-brand-200 focus:border-brand-400 resize-none" />
            </div>

            {serverError && (
              <p className="sm:col-span-2 text-sm text-rose-500 text-center">{serverError}</p>
            )}

            <div className="sm:col-span-2">
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold text-base hover:bg-brand-700 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Submitting…' : 'Submit Enrollment Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
