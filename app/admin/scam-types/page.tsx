'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ScamType {
  id: number
  name: string
  description: string
  created_at: string
}

export default function ScamTypesPage() {
  const [scamTypes, setScamTypes] = useState<ScamType[]>([])
  const [newScamType, setNewScamType] = useState({ name: '', description: '' })
  const [editingType, setEditingType] = useState<ScamType | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchScamTypes()
  }, [])

  const fetchScamTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('scam_types')
        .select('*')
        .order('name')

      if (error) throw error
      setScamTypes(data || [])
    } catch (err) {
      setError('Failed to fetch scam types')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingType) {
        const { error } = await supabase
          .from('scam_types')
          .update({
            name: newScamType.name,
            description: newScamType.description,
          })
          .eq('id', editingType.id)

        if (error) throw error
        setSuccess('Scam type updated successfully')
      } else {
        const { error } = await supabase
          .from('scam_types')
          .insert([newScamType])

        if (error) throw error
        setSuccess('Scam type added successfully')
      }

      setNewScamType({ name: '', description: '' })
      setEditingType(null)
      fetchScamTypes()
    } catch (err) {
      setError('Failed to save scam type')
    }
  }

  const handleEdit = (type: ScamType) => {
    setEditingType(type)
    setNewScamType({ name: type.name, description: type.description })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this scam type?')) return

    try {
      const { error } = await supabase
        .from('scam_types')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSuccess('Scam type deleted successfully')
      fetchScamTypes()
    } catch (err) {
      setError('Failed to delete scam type')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Scam Types</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            value={newScamType.name}
            onChange={(e) => setNewScamType({ ...newScamType, name: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            value={newScamType.description}
            onChange={(e) => setNewScamType({ ...newScamType, description: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {editingType ? 'Update Scam Type' : 'Add Scam Type'}
        </button>

        {editingType && (
          <button
            type="button"
            onClick={() => {
              setEditingType(null)
              setNewScamType({ name: '', description: '' })
            }}
            className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-xl font-bold mb-4">Existing Scam Types</h2>
        <div className="space-y-4">
          {scamTypes.map((type) => (
            <div key={type.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{type.name}</h3>
                  <p className="text-gray-600">{type.description}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(type)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 