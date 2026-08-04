const courses = [
  {
    category: 'Cloud Computing',
    title: 'AWS Solutions Architect',
    description:
      'Design and deploy scalable, fault-tolerant systems on Amazon Web Services. You will master EC2, S3, VPC, IAM, RDS, Lambda, CloudFormation and API Gateway through real-world architecture labs.',
    highlights: ['Auto Scaling & Load Balancing', 'Serverless with Lambda', 'Cloud Security & IAM', 'Cost Optimisation'],
    duration: '12 weeks',
    level: 'Intermediate',
    icon: '☁️',
  },
  {
    category: 'SAP',
    title: 'SAP S/4HANA — Finance & Controlling',
    description:
      'Comprehensive hands-on training in SAP S/4HANA with live system access. Covers core FI (General Ledger, AP, AR, Asset Accounting) and CO (Cost Centres, Profit Centres, Internal Orders) modules end-to-end.',
    highlights: ['General Ledger & Period Close', 'Accounts Payable & Receivable', 'Cost Centre Accounting', 'Profitability Analysis (CO-PA)'],
    duration: '10 weeks',
    level: 'Beginner',
    icon: '🔷',
  },
  {
    category: 'SAP',
    title: 'SAP MM & SD Integration',
    description:
      'Deep-dive into SAP Materials Management and Sales & Distribution. Learn the full Procure-to-Pay and Order-to-Cash cycles with real business scenarios including inter-company and cross-module integrations.',
    highlights: ['Purchase Orders & GR/GI', 'Vendor & Customer Master Data', 'Pricing Procedures', 'Delivery & Billing'],
    duration: '10 weeks',
    level: 'Beginner',
    icon: '🔶',
  },
  {
    category: 'Data Engineering',
    title: 'Apache Spark & Big Data Pipelines',
    description:
      'Build production-grade data pipelines processing millions of records. Covers Spark Core, Spark SQL, Structured Streaming, Kafka, Delta Lake and Airflow orchestration with a capstone ETL project.',
    highlights: ['Spark DataFrames & SQL', 'Real-time Streaming with Kafka', 'Delta Lake & Data Lakehouse', 'Airflow Orchestration'],
    duration: '10 weeks',
    level: 'Intermediate',
    icon: '⚡',
  },
  {
    category: 'Web Development & AI',
    title: 'Full-Stack Java — Spring Boot, Angular & AI',
    description:
      'Build enterprise-grade, AI-powered web applications from backend to frontend. Master Java, Spring Boot microservices, Angular UIs, and integrate real-world AI features using Spring AI and OpenAI APIs — deployed on AWS or Azure.',
    highlights: [
      'Core Java & OOP — Collections, Streams, Lambdas',
      'Spring Boot — REST APIs, Spring Security, JPA/Hibernate',
      'Angular — Components, Services, RxJS, Routing',
      'AI Integration — Spring AI, OpenAI API, Prompt Engineering',
      'Maven, Git, Docker & Cloud Deployment',
    ],
    duration: '18 weeks',
    level: 'Beginner',
    icon: '💻',
  },
  {
    category: 'DevOps',
    title: 'Docker, Kubernetes & CI/CD',
    description:
      'Containerise applications and manage them at scale. You will write Dockerfiles, deploy workloads on Kubernetes (EKS/GKE), create Helm charts, set up GitHub Actions pipelines and integrate Prometheus/Grafana monitoring.',
    highlights: ['Docker & Multi-stage Builds', 'Kubernetes Deployments & Services', 'Helm Charts & GitOps', 'GitHub Actions Pipelines'],
    duration: '8 weeks',
    level: 'Advanced',
    icon: '🚀',
  },
  {
    category: 'Data Science & AI',
    title: 'Machine Learning with Python',
    description:
      'Master supervised and unsupervised learning, deep neural networks and model deployment. Hands-on with scikit-learn, TensorFlow and PyTorch, finishing with a real-world ML project deployed as a REST API.',
    highlights: ['Regression, Classification & Clustering', 'Deep Learning & CNNs', 'Model Evaluation & Tuning', 'FastAPI Model Deployment'],
    duration: '16 weeks',
    level: 'Intermediate',
    icon: '🤖',
  },
  {
    category: 'Microsoft',
    title: 'Azure Data Engineering (DP-203)',
    description:
      'Prepare for the Microsoft Azure Data Engineer Associate certification. Covers Azure Data Factory, Synapse Analytics, Data Lake Gen2, Databricks and Stream Analytics with exam-aligned labs.',
    highlights: ['Azure Data Factory Pipelines', 'Synapse Analytics & Spark Pools', 'Azure Data Lake Gen2', 'Stream Analytics & Event Hubs'],
    duration: '8 weeks',
    level: 'Intermediate',
    icon: '🔵',
  },
  {
    category: 'Programming',
    title: 'Python for Professionals',
    description:
      'A practical Python course covering core syntax through advanced topics: OOP, file I/O, APIs, web scraping, pandas for data analysis and automation scripting. Perfect for non-developers entering tech roles.',
    highlights: ['OOP & Modules', 'REST APIs with requests', 'pandas & Data Analysis', 'Automation & Scripting'],
    duration: '6 weeks',
    level: 'Beginner',
    icon: '🐍',
  },
]

const levelColor = {
  Beginner:     'bg-emerald-100 text-emerald-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced:     'bg-rose-100 text-rose-700',
}

export default function Courses() {
  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Course Catalog</h2>
          <p className="mt-3 text-gray-500 text-lg max-w-2xl mx-auto">
            Practical, project-based programs built for today's job market — from absolute beginners to working professionals upskilling.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <div key={course.title}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow p-6 gap-4">

              <div className="flex items-start justify-between">
                <span className="text-3xl">{course.icon}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelColor[course.level]}`}>
                  {course.level}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-1">{course.category}</p>
                <h3 className="text-lg font-bold text-gray-900 leading-snug">{course.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{course.description}</p>
              </div>

              <ul className="space-y-1">
                {course.highlights.map(h => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-0.5 text-brand-500 font-bold">✓</span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-500">
                  ⏱ {course.duration}
                </span>
                <a href="#enroll"
                  className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                  Enroll →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
