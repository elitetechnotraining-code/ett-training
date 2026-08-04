import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Logo from '../components/Logo'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')

  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [search, setSearch] = useState('')
  const [filterCourse, setFilterCourse] = useState('')

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
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false })
      setLoading(false)
      if (error) { setFetchError('Failed to load enrollments.'); return }
      setEnrollments(data)
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

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
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
            <p className="text-sm text-gray-500 mt-1">Elite Tech Training</p>
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
    </div>
  )
}
