import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import BatchScroller from './components/BatchScroller'
import Hero from './components/Hero'
import Courses from './components/Courses'
import Testimonials from './components/Testimonials'
import Enroll from './components/Enroll'
import Footer from './components/Footer'
import Admin from './pages/Admin'

function getPath() {
  return window.location.pathname
}

export default function App() {
  const [path, setPath] = useState(getPath)

  useEffect(() => {
    const onPop = () => setPath(getPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  if (path === '/admin') return <Admin />

  return (
    <>
      <Navbar />
      <BatchScroller />
      <main>
        <Hero />
        <Courses />
        <Testimonials />
        <Enroll />
      </main>
      <Footer />
    </>
  )
}
