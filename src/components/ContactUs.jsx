import { useState } from 'react'
import { supabase } from '../supabaseClient'

const INITIAL = {
  name: '',
  email: '',
  phone: '',
  comment: '',
}

export default function ContactUs() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.comment.trim()) next.comment = 'Please enter your comment.'
    return next
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setLoading(true)
    setServerError('')

    const { error } = await supabase.from('contact_messages').insert([{
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      comment: form.comment.trim(),
    }])

    setLoading(false)

    if (error) {
      setServerError('Unable to submit now. Please try again shortly.')
      return
    }

    setSubmitted(true)
    setForm(INITIAL)
  }

  return (
    <section id="contact" className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Us</h2>
          <p className="mt-2 text-sm text-gray-500">Share your questions or comments and our team will get back to you.</p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-emerald-100">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-3">✓</div>
            <h3 className="text-lg font-bold text-gray-900">Thanks for reaching out!</h3>
            <p className="text-sm text-gray-500 mt-1">We received your comment and will contact you soon.</p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-5 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:border-brand-400 hover:text-brand-600 transition-colors"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Name <span className="text-rose-500">*</span></label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className={`rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 ${errors.name ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`}
              />
              {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Email <span className="text-rose-500">*</span></label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className={`rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 ${errors.email ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`}
              />
              {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Comment <span className="text-rose-500">*</span></label>
              <textarea
                name="comment"
                rows={4}
                value={form.comment}
                onChange={handleChange}
                placeholder="Write your message here..."
                className={`rounded-lg border px-4 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-brand-200 ${errors.comment ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`}
              />
              {errors.comment && <p className="text-xs text-rose-500">{errors.comment}</p>}
            </div>

            {serverError && <p className="sm:col-span-2 text-sm text-rose-500 text-center">{serverError}</p>}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand-600 text-white font-semibold text-sm py-2.5 hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Comment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

