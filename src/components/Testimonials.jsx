const testimonials = [
  {
    name: 'Aisha Patel',
    role: 'Cloud Engineer at Deloitte',
    course: 'AWS Solutions Architect',
    quote: 'The course was incredibly practical. Within two months of completing it I landed my first cloud role. The hands-on labs made all the difference.',
    avatar: 'AP',
  },
  {
    name: 'Carlos Mendez',
    role: 'Data Engineer at Spotify',
    course: 'Apache Spark & Big Data',
    quote: 'Best investment I made in my career. Marcus knows exactly what companies are looking for and structures the course around real production scenarios.',
    avatar: 'CM',
  },
  {
    name: 'Yuki Tanaka',
    role: 'SAP Consultant at Accenture',
    course: 'SAP S/4HANA Fundamentals',
    quote: 'I had zero SAP background. Eight weeks later I was interviewing confidently for SAP roles. The instructors were patient and incredibly knowledgeable.',
    avatar: 'YT',
  },
  {
    name: 'Fatima Al-Hassan',
    role: 'Full-Stack Developer at Stripe',
    course: 'Full-Stack with React & Node',
    quote: 'The curriculum is kept very up-to-date — they were already covering the latest React patterns before most bootcamps caught on. Highly recommend.',
    avatar: 'FA',
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Our Graduates Say</h2>
          <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
            Real stories from professionals who transformed their careers with Elite Tech training.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map(t => (
            <div key={t.name}
              className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
              <Stars />
              <p className="text-gray-700 leading-relaxed text-sm">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-auto pt-2 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
                <span className="ml-auto text-xs text-brand-600 font-medium bg-brand-50 px-2.5 py-1 rounded-full">
                  {t.course}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
