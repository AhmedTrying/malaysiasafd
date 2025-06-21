import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-16 font-sans">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-400">About Malaysia Scam and Fraud Dashboard</h1>
        <p className="text-lg text-gray-200 mb-4">
          The <span className="font-bold text-white">Malaysia Scam and Fraud Dashboard</span> is a national platform designed to monitor, analyze, and raise awareness about scam and fraud activities across Malaysia. Built using real data from news, official reports, and social media, the dashboard provides meaningful insights through clear visualizations and trend analysis.
        </p>
        <p className="text-lg text-gray-200 mb-4">
          Its goal is to support the public, investigators, and policymakers by offering accessible data on scam patterns, financial losses, and fraud types. Using logistic regression, the system also includes predictive capabilities to forecast potential fraud trends based on historical cases.
        </p>
        <p className="text-lg text-gray-200 mb-4">
          We believe in transparency, community collaboration, and the power of data to create a safer digital environment. You can contribute by submitting feedback, reporting suspicious activity, and staying updated through the dashboard.
        </p>
        <blockquote className="border-l-4 border-blue-500 pl-4 text-blue-200 italic mb-6">
          Together, let's make Malaysia more resilient to fraud.
        </blockquote>
        <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full transition shadow">
          Back to Home
        </Link>
      </div>
    </div>
  )
} 