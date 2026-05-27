'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppHeader } from '@/components/AppHeader'
import { Spinner } from '@/components/ui/Spinner'

interface UserProfile {
  id: string
  displayName: string
  role: string
  email: string
  yearsExperience?: number
  provinceCode?: string
  bio?: string
  trades: { id: string; name: string }[]
  status: string
}

async function fetchData(path: string) {
  try {
    const res = await fetch(path, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error(`Failed to fetch ${path}:`, error)
    return null
  }
}

export default function ProfileEditPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    displayName: '',
    yearsExperience: '',
    provinceCode: '',
    bio: '',
  })

  useEffect(() => {
    async function load() {
      try {
        const profileData = await fetchData('/api/users/me')
        if (profileData) {
          setProfile(profileData)
          setFormData({
            displayName: profileData.displayName || '',
            yearsExperience: profileData.yearsExperience?.toString() || '',
            provinceCode: profileData.provinceCode || '',
            bio: profileData.bio || '',
          })
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.displayName,
          yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : undefined,
          provinceCode: formData.provinceCode || undefined,
          bio: formData.bio || undefined,
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      router.push('/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="flex items-center justify-center min-h-screen">
          <Spinner label="Loading profile..." />
        </div>
      </>
    )
  }

  if (!profile) {
    return (
      <>
        <AppHeader />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-center text-red-600">Unable to load profile</p>
        </div>
      </>
    )
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-ink-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/profile" className="text-trades-600 hover:text-trades-700 font-medium">
              ← Back to profile
            </Link>
          </div>

          <div className="bg-white border border-ink-200 rounded-xl p-8">
            <h1 className="text-3xl font-bold text-ink-900 mb-6">Edit Profile</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-ink-900 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trades-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="yearsExperience" className="block text-sm font-medium text-ink-900 mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="yearsExperience"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  min="0"
                  max="70"
                  className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trades-500"
                />
              </div>

              <div>
                <label htmlFor="provinceCode" className="block text-sm font-medium text-ink-900 mb-2">
                  Province
                </label>
                <select
                  id="provinceCode"
                  name="provinceCode"
                  value={formData.provinceCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trades-500"
                >
                  <option value="">Select a province</option>
                  <option value="AB">Alberta</option>
                  <option value="BC">British Columbia</option>
                  <option value="MB">Manitoba</option>
                  <option value="NB">New Brunswick</option>
                  <option value="NL">Newfoundland and Labrador</option>
                  <option value="NS">Nova Scotia</option>
                  <option value="ON">Ontario</option>
                  <option value="PE">Prince Edward Island</option>
                  <option value="QC">Quebec</option>
                  <option value="SK">Saskatchewan</option>
                </select>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-ink-900 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-ink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-trades-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-4 pt-6 border-t border-ink-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center px-6 py-2 bg-trades-500 text-white rounded-lg font-medium hover:bg-trades-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <Link
                  href="/profile"
                  className="flex items-center justify-center px-6 py-2 border border-ink-300 text-ink-900 rounded-lg font-medium hover:bg-ink-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
