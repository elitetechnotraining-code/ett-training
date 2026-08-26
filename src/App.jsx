import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import BatchScroller from './components/BatchScroller'
import Hero from './components/Hero'
import DemoOptions from './components/DemoOptions'
import Courses from './components/Courses'
import Testimonials from './components/Testimonials'
import Enroll from './components/Enroll'
import ContactUs from './components/ContactUs'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Admin from './pages/Admin'
import Demo from './pages/Demo'

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
  if (path === '/demo') return <Demo />

  return (
    <>
      <Navbar />
      <BatchScroller />
      <main>
        <DemoOptions />
        <Hero />
        <Courses />
        <Testimonials />
        <Enroll />
        <ContactUs />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
