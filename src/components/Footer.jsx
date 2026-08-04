import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="mb-3 brightness-200">
            <Logo size={40} />
          </div>
          <p className="text-sm leading-relaxed">
            Empowering professionals with technology skills that matter — from beginner to expert.
          </p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Quick Links</p>
          <ul className="space-y-2 text-sm">
            {['#courses', '#trainers', '#testimonials', '#enroll'].map(href => (
              <li key={href}>
                <a href={href} className="hover:text-white transition-colors capitalize">
                  {href.replace('#', '')}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>elitetechnotraining@gmail.com</li>
            <li>+91 90595 71845</li>
            <li>Sun–Sat, 24 Hours</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <span>&copy; {new Date().getFullYear()} Elite Tech Training. All rights reserved.</span>
        <a href="/admin" className="text-gray-600 hover:text-gray-400 transition-colors">Admin Portal</a>
      </div>
    </footer>
  )
}
