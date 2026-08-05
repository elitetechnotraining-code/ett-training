import Logo from './Logo'

export default function Hero() {
  return (
    <section className="pt-10 pb-20 bg-gradient-to-br from-brand-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-6">

        {/* Logo centred in hero */}
        <div className="mb-2">
          <Logo size={72} showText={false} />
        </div>

        <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold tracking-wide">
          Industry-Ready Technology Training
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight max-w-3xl">
          Master the Technologies <br className="hidden sm:block" />
          <span className="text-brand-600">That Drive the Future</span>
        </h1>

        <p className="max-w-xl text-lg text-gray-500 leading-relaxed">
          Hands-on courses taught by practitioners at Elite Tech Solutions. From cloud and data engineering to SAP and full-stack development — build job-ready skills at your own pace.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <a href="#courses"
            className="px-7 py-3 rounded-xl bg-brand-600 text-white font-semibold text-base hover:bg-brand-700 transition-colors shadow-md shadow-brand-200">
            Browse Courses
          </a>
          <a href="#enroll"
            className="px-7 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-base hover:border-brand-400 hover:text-brand-600 transition-colors">
            Enroll Now
          </a>
        </div>

        {/* Stats bar */}
        <div className="mt-10 grid grid-cols-3 gap-6 sm:gap-12 w-full max-w-lg">
          {[
            { value: '50+', label: 'Courses' },
            { value: '2,000+', label: 'Graduates' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-extrabold text-brand-600">{s.value}</span>
              <span className="text-sm text-gray-500 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
