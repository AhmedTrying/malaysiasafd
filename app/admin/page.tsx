'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AdminDashboard() {
  const [isExporting, setIsExporting] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleExportCases = async () => {
    try {
      setIsExporting(true)
      const response = await fetch('/api/export-cases')
      
      if (!response.ok) {
        throw new Error('Failed to export cases')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `cases_${new Date().toISOString()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting cases:', error)
      alert('Failed to export cases. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleExportCases}
            disabled={isExporting}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isExporting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isExporting ? 'Exporting...' : 'Export All Cases'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Scam Types</h2>
            <p className="text-gray-600 mb-4">
              Add, edit, or remove scam types from the system.
            </p>
            <button
              onClick={() => router.push('/admin/scam-types')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Manage Scam Types
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">View Feedback</h2>
            <p className="text-gray-600 mb-4">
              View and manage user feedback and ratings.
            </p>
            <button
              onClick={() => router.push('/admin/feedback')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Feedback
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
            <p className="text-gray-600 mb-4">
              View and manage user accounts and permissions.
            </p>
            <button
              onClick={() => router.push('/admin/users')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 