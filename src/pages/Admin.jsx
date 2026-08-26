import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Logo from '../components/Logo'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

const initialNotificationForm = {
  badge: 'Free Demo Class',
  title: 'Full-Stack Java + Angular + AI',
  subtitle: 'Live online session - absolutely free!',
  eventDate: 'Sat, 15th Aug 2026',
  eventTime: '7:00 PM IST',
  mode: 'Online (Zoom)',
  fee: 'FREE',
  primaryCtaLabel: '🚀 Reserve My Free Seat',
  primaryCtaUrl: '/demo',
  secondaryCtaLabel: "No thanks, I'll skip this",
  isActive: true,
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')

  const [enrollments, setEnrollments] = useState([])
  const [demoRegistrations, setDemoRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [demoFetchError, setDemoFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [filterCourse, setFilterCourse] = useState('')
  const [selectedDemoFilter, setSelectedDemoFilter] = useState('')

  const [notificationId, setNotificationId] = useState(null)
  const [notificationList, setNotificationList] = useState([])
  const [notificationForm, setNotificationForm] = useState(initialNotificationForm)
  const [notificationLoading, setNotificationLoading] = useState(false)
  const [notificationError, setNotificationError] = useState('')
  const [notificationSuccess, setNotificationSuccess] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setPwError('Incorrect password.')
    }
  }

  useEffect(() => {
    if (!authed) return
    async function fetchData() {
      setLoading(true)
      const [
        { data, error },
        { data: notificationData, error: notificationFetchError },
        { data: demoRegistrationData, error: demoRegistrationFetchError },
      ] = await Promise.all([
        supabase
          .from('enrollments')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('demo_notifications')
          .select('*')
          .order('updated_at', { ascending: false }),
        supabase
          .from('demo_registrations')
          .select('*')
          .order('created_at', { ascending: false }),
      ])

      setLoading(false)
      if (error) { setFetchError('Failed to load enrollments.'); return }
      setEnrollments(data)

      if (demoRegistrationFetchError) {
        setDemoFetchError('Failed to load demo registrations.')
      } else {
        setDemoFetchError('')
        setDemoRegistrations(demoRegistrationData || [])
      }

      if (notificationFetchError) {
        setNotificationError('Failed to load demo notification settings. Ensure the demo_notifications table exists.')
        return
      }

      const allNotifications = notificationData || []
      setNotificationList(allNotifications)

      const latestNotification = allNotifications[0]
      if (!latestNotification) {
        setNotificationId(null)
        setNotificationForm(initialNotificationForm)
        return
      }

      setNotificationId(latestNotification.id)
      setNotificationForm(mapNotificationToForm(latestNotification))
    }
    fetchData()
  }, [authed])

  const courses = [...new Set(enrollments.map(e => e.course))].sort()

  const filtered = enrollments.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)
    const matchCourse = !filterCourse || e.course === filterCourse
    return matchSearch && matchCourse
  })

  function getLegacyDemoLabel(experience = '') {
    const marker = '| Demo:'
    const idx = experience.indexOf(marker)
    if (idx === -1) return ''
    return experience.slice(idx + marker.length).trim()
  }

  const filteredDemoRegistrations = demoRegistrations.filter(item => {
    if (!selectedDemoFilter) return true
    return item.demo_id === selectedDemoFilter
  })

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  function handleNotificationChange(field, value) {
    setNotificationForm(prev => ({ ...prev, [field]: value }))
    setNotificationError('')
    setNotificationSuccess('')
  }

  function handleResetDemoNotification() {
    setNotificationForm(initialNotificationForm)
    setNotificationError('')
    setNotificationSuccess('Demo notification reset to defaults. Click save to apply.')
  }

  function mapNotificationToForm(item) {
    return {
      badge: item.badge || initialNotificationForm.badge,
      title: item.title || initialNotificationForm.title,
      subtitle: item.subtitle || initialNotificationForm.subtitle,
      eventDate: item.event_date || initialNotificationForm.eventDate,
      eventTime: item.event_time || initialNotificationForm.eventTime,
      mode: item.mode || initialNotificationForm.mode,
      fee: item.fee || initialNotificationForm.fee,
      primaryCtaLabel: item.primary_cta_label || initialNotificationForm.primaryCtaLabel,
      primaryCtaUrl: item.primary_cta_url || initialNotificationForm.primaryCtaUrl,
      secondaryCtaLabel: item.secondary_cta_label || initialNotificationForm.secondaryCtaLabel,
      isActive: Boolean(item.is_active),
    }
  }

  function handleCreateNewDemo() {
    setNotificationId(null)
    setNotificationForm(initialNotificationForm)
    setNotificationError('')
    setNotificationSuccess('Creating a new demo notification.')
  }

  function handleEditDemo(item) {
    setNotificationId(item.id)
    setNotificationForm(mapNotificationToForm(item))
    setNotificationError('')
    setNotificationSuccess(`Editing demo: ${item.title}`)
  }

  async function handleNotificationSave(e) {
    e.preventDefault()

    const title = notificationForm.title.trim()
    if (!title) {
      setNotificationError('Demo title is required.')
      return
    }

    setNotificationLoading(true)
    setNotificationError('')
    setNotificationSuccess('')

    const payload = {
      badge: notificationForm.badge.trim() || null,
      title,
      subtitle: notificationForm.subtitle.trim() || null,
      event_date: notificationForm.eventDate.trim() || null,
      event_time: notificationForm.eventTime.trim() || null,
      mode: notificationForm.mode.trim() || null,
      fee: notificationForm.fee.trim() || null,
      primary_cta_label: notificationForm.primaryCtaLabel.trim() || null,
      primary_cta_url: notificationForm.primaryCtaUrl.trim() || null,
      secondary_cta_label: notificationForm.secondaryCtaLabel.trim() || null,
      is_active: notificationForm.isActive,
    }

    const query = notificationId
      ? supabase.from('demo_notifications').update(payload).eq('id', notificationId).select().single()
      : supabase.from('demo_notifications').insert(payload).select().single()

    const { data, error } = await query
    setNotificationLoading(false)

    if (error) {
      const details = [error.message, error.details].filter(Boolean).join(' - ')
      setNotificationError(`Could not save demo notification. ${details || 'Please verify table permissions and try again.'}`)
      return
    }

    setNotificationId(data.id)
    setNotificationList(prev => {
      const existing = prev.find(item => item.id === data.id)
      if (existing) return prev.map(item => (item.id === data.id ? data : item))
      return [data, ...prev]
    })
    setNotificationSuccess(notificationId ? 'Demo notification updated successfully.' : 'New demo notification created successfully.')
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm flex flex-col gap-4">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Logo size={52} showText={false} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-sm text-gray-500 mt-1">Elite Tech Solutions</p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setPwError('') }}
              placeholder="Enter admin password"
              className={`rounded-lg border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 ${pwError ? 'border-rose-400' : 'border-gray-200 focus:border-brand-400'}`}
            />
            {pwError && <p className="text-xs text-rose-500">{pwError}</p>}
          </div>
          <button type="submit"
            className="py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors">
            Sign In
          </button>
          <a href="/" className="text-center text-xs text-gray-400 hover:text-brand-600 transition-colors">← Back to site</a>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={36} />
          <span className="text-gray-400 text-sm ml-1">/ Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{enrollments.length} total enrollments</span>
          <button onClick={() => setAuthed(false)}
            className="text-sm text-gray-500 hover:text-rose-500 transition-colors">Sign out</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <section className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 sm:p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Demo Notification</h2>
            <p className="text-sm text-gray-500 mt-1">Configure the popup shown to visitors on the homepage.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <form onSubmit={handleNotificationSave} className="grid gap-4">
              <div className="grid gap-1">
              <label className="text-sm font-semibold text-gray-700">Badge</label>
              <input
                type="text"
                value={notificationForm.badge}
                onChange={e => handleNotificationChange('badge', e.target.value)}
                placeholder="Free Demo Class"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
              </div>

              <div className="grid gap-1">
              <label className="text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                value={notificationForm.title}
                onChange={e => handleNotificationChange('title', e.target.value)}
                placeholder="Full-Stack Java + Angular + AI"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
              </div>

              <div className="grid gap-1">
              <label className="text-sm font-semibold text-gray-700">Subtitle</label>
              <textarea
                rows={2}
                value={notificationForm.subtitle}
                onChange={e => handleNotificationChange('subtitle', e.target.value)}
                placeholder="Live online session - absolutely free!"
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-gray-700">Date</label>
                <input
                  type="text"
                  value={notificationForm.eventDate}
                  onChange={e => handleNotificationChange('eventDate', e.target.value)}
                  placeholder="Sat, 15th Aug 2026"
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-gray-700">Time</label>
                <input
                  type="text"
                  value={notificationForm.eventTime}
                  onChange={e => handleNotificationChange('eventTime', e.target.value)}
                  placeholder="7:00 PM IST"
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-gray-700">Mode</label>
                <input
                  type="text"
                  value={notificationForm.mode}
                  onChange={e => handleNotificationChange('mode', e.target.value)}
                  placeholder="Online (Zoom)"
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-gray-700">Fee</label>
                <input
                  type="text"
                  value={notificationForm.fee}
                  onChange={e => handleNotificationChange('fee', e.target.value)}
                  placeholder="FREE"
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-gray-700">Primary CTA Label</label>
                <input
                  type="text"
                  value={notificationForm.primaryCtaLabel}
                  onChange={e => handleNotificationChange('primaryCtaLabel', e.target.value)}
                  placeholder="🚀 Reserve My Free Seat"
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-gray-700">Primary CTA URL</label>
                <input
                  type="text"
                  value={notificationForm.primaryCtaUrl}
                  onChange={e => handleNotificationChange('primaryCtaUrl', e.target.value)}
                  placeholder="/demo"
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 items-end">
              <div className="grid gap-1">
                <label className="text-sm font-semibold text-gray-700">Secondary CTA Label</label>
                <input
                  type="text"
                  value={notificationForm.secondaryCtaLabel}
                  onChange={e => handleNotificationChange('secondaryCtaLabel', e.target.value)}
                  placeholder="No thanks, I'll skip this"
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={notificationForm.isActive}
                  onChange={e => handleNotificationChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-400"
                />
                Show this demo popup on site
              </label>
              </div>

              {notificationError && <p className="text-sm text-rose-500">{notificationError}</p>}
              {notificationSuccess && <p className="text-sm text-emerald-600">{notificationSuccess}</p>}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={notificationLoading}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {notificationLoading ? 'Saving...' : 'Save Demo Notification'}
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewDemo}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  New Demo
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Open Popup Preview
                </button>
                <button
                  type="button"
                  onClick={handleResetDemoNotification}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm hover:text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset Defaults
                </button>
              </div>

              {notificationList.length > 0 && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Saved Demos ({notificationList.length})</p>
                  <div className="flex flex-col gap-2 max-h-48 overflow-auto">
                    {notificationList.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleEditDemo(item)}
                        className={`text-left rounded-lg border px-3 py-2 transition-colors ${notificationId === item.id ? 'border-brand-300 bg-brand-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                      >
                        <p className="text-sm font-semibold text-gray-800">{item.title || 'Untitled demo'}</p>
                        <p className="text-xs text-gray-500">{item.event_date || '-'} | {item.event_time || '-'} | {item.mode || '-'}</p>
                        <p className={`text-xs mt-1 font-medium ${item.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {item.is_active ? 'Active on site' : 'Inactive'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Live Preview</p>
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                <div className="bg-gradient-to-r from-brand-700 to-indigo-600 px-5 py-4 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-gray-900 text-xs font-bold uppercase tracking-wide mb-2">
                    {notificationForm.badge || 'Free Demo Class'}
                  </span>
                  <h3 className="text-lg font-extrabold leading-snug">
                    {notificationForm.title || 'Full-Stack Java + Angular + AI'}
                  </h3>
                  <p className="text-brand-200 text-sm mt-1">
                    {notificationForm.subtitle || 'Live online session - absolutely free!'}
                  </p>
                </div>

                <div className="px-5 py-4 flex flex-col gap-3">
                  {[
                    { icon: '📅', label: 'Date', value: notificationForm.eventDate || 'Sat, 15th Aug 2026' },
                    { icon: '🕖', label: 'Time', value: notificationForm.eventTime || '7:00 PM IST' },
                    { icon: '💻', label: 'Mode', value: notificationForm.mode || 'Online (Zoom)' },
                    { icon: '💰', label: 'Fee', value: notificationForm.fee || 'FREE' },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">{item.label}</p>
                        <p className="text-sm font-bold text-gray-800">{item.value}</p>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm cursor-default"
                  >
                    {notificationForm.primaryCtaLabel || '🚀 Reserve My Free Seat'}
                  </button>
                  <p className="text-center text-sm text-gray-400">
                    {notificationForm.secondaryCtaLabel || "No thanks, I'll skip this"}
                  </p>

                  {!notificationForm.isActive && (
                    <p className="text-xs text-amber-600 font-medium text-center">Popup is currently disabled</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Demo Registrations</h2>
              <p className="text-sm text-gray-500 mt-1">Users can enroll for a particular demo; filter them here.</p>
            </div>
            <select
              value={selectedDemoFilter}
              onChange={e => setSelectedDemoFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 bg-white sm:w-80"
            >
              <option value="">All Demos</option>
              {notificationList.map(item => (
                <option key={item.id} value={item.id}>
                  {(item.title || 'Untitled demo')} - {(item.event_date || 'No date')} {(item.event_time || '')}
                </option>
              ))}
            </select>
          </div>

          {demoFetchError && <p className="text-rose-500 text-sm">{demoFetchError}</p>}

          {!demoFetchError && (
            <>
              {filteredDemoRegistrations.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No demo registrations found.</div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {['#', 'Name', 'Email', 'Phone', 'Experience', 'Demo', 'Date'].map(h => (
                          <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDemoRegistrations.map((item, idx) => (
                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                          <td className="px-4 py-3 text-gray-600">{item.email}</td>
                          <td className="px-4 py-3 text-gray-500">{item.phone || '-'}</td>
                          <td className="px-4 py-3 text-gray-500">{item.experience?.split('| Demo:')[0]?.trim() || '-'}</td>
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                            {item.demo_title || getLegacyDemoLabel(item.experience) || '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(item.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="mt-3 text-xs text-gray-400">Showing {filteredDemoRegistrations.length} of {demoRegistrations.length} demo registrations</p>
            </>
          )}
        </section>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enrolled Students</h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 flex-1"
          />
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-200 bg-white sm:w-72">
            <option value="">All Courses</option>
            {courses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading && <p className="text-gray-500 text-sm">Loading…</p>}
        {fetchError && <p className="text-rose-500 text-sm">{fetchError}</p>}

        {!loading && !fetchError && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">No enrollments found.</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['#', 'Name', 'Email', 'Phone', 'Course', 'Message', 'Date'].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e, i) => (
                      <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{e.name}</td>
                        <td className="px-4 py-3 text-gray-600">{e.email}</td>
                        <td className="px-4 py-3 text-gray-500">{e.phone || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium whitespace-nowrap">
                            {e.course}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{e.message || '—'}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(e.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-3 text-xs text-gray-400">Showing {filtered.length} of {enrollments.length} enrollments</p>
          </>
        )}
      </main>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPreviewOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-brand-700 to-indigo-600 px-6 py-4 text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-400 text-gray-900 text-xs font-bold uppercase tracking-wide mb-2">
                {notificationForm.badge || 'Free Demo Class'}
              </span>
              <h2 className="text-xl font-extrabold leading-snug">{notificationForm.title || 'Full-Stack Java + Angular + AI'}</h2>
              <p className="text-brand-200 text-sm mt-1">{notificationForm.subtitle || 'Live online session - absolutely free!'}</p>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '📅', label: 'Date', value: notificationForm.eventDate || 'Sat, 15th Aug 2026' },
                  { icon: '🕖', label: 'Time', value: notificationForm.eventTime || '7:00 PM IST' },
                  { icon: '💻', label: 'Mode', value: notificationForm.mode || 'Online (Zoom)' },
                  { icon: '💰', label: 'Fee', value: notificationForm.fee || 'FREE' },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3 flex items-start gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">{item.label}</p>
                      <p className="text-sm font-bold text-gray-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <button type="button" className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-center text-base cursor-default">
                  {notificationForm.primaryCtaLabel || '🚀 Reserve My Free Seat'}
                </button>
                <p className="w-full py-2 text-sm text-gray-400 text-center">
                  {notificationForm.secondaryCtaLabel || "No thanks, I'll skip this"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute top-3 right-3 text-white/70 hover:text-white text-xl leading-none"
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
