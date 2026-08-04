export default function Logo({ size = 40, showText = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Book base */}
        <path
          d="M10 52 Q10 58 16 60 L40 64 L64 60 Q70 58 70 52 L70 46 Q64 49 40 49 Q16 49 10 46 Z"
          fill="#4338ca"
        />
        {/* Left book page */}
        <path
          d="M10 46 Q10 52 16 54 L40 57 L40 20 Q28 18 18 22 Q10 26 10 34 Z"
          fill="#6366f1"
        />
        {/* Right book page */}
        <path
          d="M70 46 Q70 52 64 54 L40 57 L40 20 Q52 18 62 22 Q70 26 70 34 Z"
          fill="#818cf8"
        />
        {/* Book spine center line */}
        <line x1="40" y1="20" x2="40" y2="57" stroke="#c7d2fe" strokeWidth="1.5" />

        {/* Tree trunk */}
        <path
          d="M40 48 L40 30"
          stroke="#4338ca"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Left branch */}
        <path
          d="M40 40 Q32 36 28 30"
          stroke="#4338ca"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right branch */}
        <path
          d="M40 38 Q48 33 52 27"
          stroke="#4338ca"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Left leaf cluster */}
        <ellipse cx="25" cy="26" rx="8" ry="6" fill="#22c55e" transform="rotate(-20 25 26)" />
        <ellipse cx="20" cy="22" rx="6" ry="4.5" fill="#16a34a" transform="rotate(-35 20 22)" />
        <ellipse cx="30" cy="22" rx="5" ry="4" fill="#4ade80" transform="rotate(-5 30 22)" />

        {/* Right leaf cluster */}
        <ellipse cx="55" cy="23" rx="8" ry="6" fill="#22c55e" transform="rotate(20 55 23)" />
        <ellipse cx="60" cy="19" rx="6" ry="4.5" fill="#16a34a" transform="rotate(35 60 19)" />
        <ellipse cx="50" cy="19" rx="5" ry="4" fill="#4ade80" transform="rotate(5 50 19)" />

        {/* Top center leaf */}
        <ellipse cx="40" cy="16" rx="7" ry="5.5" fill="#22c55e" />
        <ellipse cx="36" cy="13" rx="5" ry="3.5" fill="#16a34a" transform="rotate(-15 36 13)" />
        <ellipse cx="44" cy="13" rx="5" ry="3.5" fill="#4ade80" transform="rotate(15 44 13)" />

        {/* Star / light on top */}
        <circle cx="40" cy="9" r="3" fill="#fbbf24" />
        <circle cx="40" cy="9" r="1.5" fill="#fef3c7" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold text-lg text-brand-700 tracking-tight">Elite Tech</span>
          <span className="font-semibold text-sm text-green-600 tracking-widest uppercase">Training</span>
        </div>
      )}
    </div>
  )
}
