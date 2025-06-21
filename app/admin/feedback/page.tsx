'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Feedback {
  id: number
  user_id: string
  feedback_text: string
  rating: number
  created_at: string
  users: {
    email: string
    full_name: string
  }
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([])
  const [dateFilter, setDateFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [error, setError] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchFeedback()
  }, [])

  useEffect(() => {
    filterFeedback()
  }, [feedback, dateFilter, ratingFilter, userFilter])

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          users (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeedback(data || [])
      setFilteredFeedback(data || [])
    } catch (err) {
      setError('Failed to fetch feedback')
    }
  }

  const filterFeedback = () => {
    let filtered = [...feedback]

    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter(
        (item) => new Date(item.created_at).toDateString() === filterDate.toDateString()
      )
    }

    if (ratingFilter) {
      filtered = filtered.filter((item) => item.rating === parseInt(ratingFilter))
    }

    if (userFilter) {
      const searchTerm = userFilter.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.users.email.toLowerCase().includes(searchTerm) ||
          item.users.full_name.toLowerCase().includes(searchTerm)
      )
    }

    setFilteredFeedback(filtered)
  }

  const exportToCSV = () => {
    const headers = ['Date', 'User', 'Rating', 'Feedback']
    const csvData = filteredFeedback.map((item) => [
      new Date(item.created_at).toLocaleString(),
      `${item.users.full_name} (${item.users.email})`,
      item.rating,
      item.feedback_text,
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `feedback_export_${new Date().toISOString()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feedback Management</h1>
        <button
          onClick={exportToCSV}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Filter by Rating
            </label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">All Ratings</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Stars
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Filter by User
            </label>
            <input
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Search by name or email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredFeedback.map((item) => (
            <div key={item.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {item.users.full_name}
                    </h3>
                    <span className="text-gray-500">({item.users.email})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${
                            i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{item.feedback_text}</p>
                </div>
              </div>
            </div>
          ))}

          {filteredFeedback.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No feedback found matching the current filters
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 