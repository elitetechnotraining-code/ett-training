const trainers = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Cloud & DevOps Lead',
    bio: '12 years at AWS and Google Cloud. Certified Solutions Architect and Kubernetes administrator with a passion for teaching infrastructure at scale.',
    tags: ['AWS', 'Kubernetes', 'Terraform'],
    avatar: 'PS',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    name: 'Marcus Lee',
    role: 'Data Engineering Expert',
    bio: 'Former data platform engineer at Netflix. Built petabyte-scale pipelines with Spark, Kafka, and Airflow. Now helps others do the same.',
    tags: ['Spark', 'Kafka', 'Python'],
    avatar: 'ML',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    name: 'Sarah Müller',
    role: 'SAP Solutions Architect',
    bio: '15 years of SAP implementation and consulting across manufacturing, retail, and finance. SAP-certified in FI/CO and S/4HANA.',
    tags: ['SAP S/4HANA', 'FI/CO', 'ABAP'],
    avatar: 'SM',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'James Okafor',
    role: 'Full-Stack & ML Instructor',
    bio: 'Built production ML systems at Spotify and two YC-backed startups. Loves making machine learning approachable for software engineers.',
    tags: ['React', 'Node.js', 'PyTorch'],
    avatar: 'JO',
    color: 'bg-amber-100 text-amber-700',
  },
]

export default function Trainers() {
  return (
    <section id="trainers" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Meet Your Trainers</h2>
          <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
            Every instructor is a practitioner with real-world industry experience.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trainers.map(t => (
            <div key={t.name}
              className="flex flex-col items-center text-center bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${t.color}`}>
                {t.avatar}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{t.name}</h3>
                <p className="text-sm text-brand-600 font-medium mt-0.5">{t.role}</p>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{t.bio}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-auto pt-2">
                {t.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
