"use client"

import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={48} height={48} className="rounded" />
          <span className="text-lg md:text-2xl font-bold tracking-tight text-blue-400 whitespace-nowrap">Malaysia Scam and Fraud Dashboard</span>
        </div>
        <div className="hidden md:flex gap-8 text-gray-200 font-medium">
          <Link href="/about" className="hover:text-blue-400 transition">About</Link>
        </div>
        <div className="flex gap-2 ml-2">
          <Link href="/login" className="bg-white text-blue-700 font-semibold px-4 md:px-5 py-2 rounded-full shadow hover:bg-blue-100 transition whitespace-nowrap">Login</Link>
          <Link href="/signup" className="bg-blue-500 text-white font-semibold px-4 md:px-5 py-2 rounded-full shadow hover:bg-blue-600 transition whitespace-nowrap">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-4 md:px-8 py-8 md:py-12 gap-10 md:gap-20">
          {/* Left: Headline & CTA */}
          <div className="flex-1 flex flex-col justify-center items-start max-w-xl">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-white text-left">
              Malaysia Scam and Fraud Dashboard
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-8 text-left">
              Track, analyze, and prevent scams with real-time data and AI-powered insights. Join our mission to create a safer digital environment for everyone in Malaysia.
            </p>
            <Link href="/signup" className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg transition mb-4">
              Get Started
            </Link>
            <div className="mt-2 text-gray-400 text-sm text-left">
              Already have an account? <Link href="/login" className="underline hover:text-blue-400">Login</Link>
            </div>
          </div>
          {/* Right: Illustration */}
          <div className="flex-1 flex justify-center items-center w-full min-w-[200px]">
            <div className="w-[200px] h-[200px] md:w-[280px] md:h-[280px] bg-gray-200 rounded-lg flex items-center justify-center shadow-2xl">
              <Image
                src="/placeholder.png"
                alt="Dashboard Illustration"
                width={260}
                height={260}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Decorative SVG Wave */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
          <path fill="#2563eb" fillOpacity="0.15" d="M0,64L48,74.7C96,85,192,107,288,117.3C384,128,480,128,576,117.3C672,107,768,85,864,85.3C960,85,1056,107,1152,117.3C1248,128,1344,128,1392,128L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </svg>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-center py-4 text-gray-400 text-sm border-t border-gray-800 mt-auto">
        &copy; {new Date().getFullYear()} Malaysia Scam and Fraud Dashboard. All rights reserved.
      </footer>
    </div>
  )
}
