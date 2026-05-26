'use client'

import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/Spinner'

interface NotificationPrefs {
  weeklyDigest: boolean
  endorsements: boolean
  credentialUpdates: boolean
  communityActivity: boolean
  marketing: boolean
}

interface NotificationPrefsFormProps {
  onSuccess: (prefs: NotificationPrefs) => void
  onError: (error: string) => void
}

export function NotificationPrefsForm({
  onSuccess,
  onError,
}: NotificationPrefsFormProps) {
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    weeklyDigest: true,
    endorsements: true,
    credentialUpdates: true,
    communityActivity: false,
    marketing: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await fetch('/api/users/me/notification-preferences')
        if (!res.ok) throw new Error('Failed to fetch preferences')
        const data = await res.json()
        setPrefs(data)
      } catch (err) {
        console.error('Error fetching preferences:', err)
        // Use defaults on error
      } finally {
        setLoading(false)
      }
    }

    fetchPrefs()
  }, [])

  const handleToggle = (key: keyof NotificationPrefs) => {
    setPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/users/me/notification-preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save preferences')
      }

      const updated = await res.json()
      onSuccess(updated)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      onError(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner label="Loading preferences..." />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Weekly Digest */}
        <div className="flex items-start gap-4 rounded-lg border border-trades-200 bg-white p-4">
          <input
            type="checkbox"
            id="weeklyDigest"
            checked={prefs.weeklyDigest}
            onChange={() => handleToggle('weeklyDigest')}
            className="mt-1 h-5 w-5 cursor-pointer rounded border-trades-300 text-trades-500"
          />
          <div className="flex-1">
            <label
              htmlFor="weeklyDigest"
              className="block font-medium text-ink-900 cursor-pointer"
            >
              Weekly Digest
            </label>
            <p className="text-sm text-ink-600 mt-1">
              A weekly summary of activity in your trade
            </p>
          </div>
        </div>

        {/* Endorsements */}
        <div className="flex items-start gap-4 rounded-lg border border-trades-200 bg-white p-4">
          <input
            type="checkbox"
            id="endorsements"
            checked={prefs.endorsements}
            onChange={() => handleToggle('endorsements')}
            className="mt-1 h-5 w-5 cursor-pointer rounded border-trades-300 text-trades-500"
          />
          <div className="flex-1">
            <label
              htmlFor="endorsements"
              className="block font-medium text-ink-900 cursor-pointer"
            >
              Endorsements
            </label>
            <p className="text-sm text-ink-600 mt-1">
              When someone endorses your expertise
            </p>
          </div>
        </div>

        {/* Credential Updates */}
        <div className="flex items-start gap-4 rounded-lg border border-trades-200 bg-white p-4">
          <input
            type="checkbox"
            id="credentialUpdates"
            checked={prefs.credentialUpdates}
            onChange={() => handleToggle('credentialUpdates')}
            className="mt-1 h-5 w-5 cursor-pointer rounded border-trades-300 text-trades-500"
          />
          <div className="flex-1">
            <label
              htmlFor="credentialUpdates"
              className="block font-medium text-ink-900 cursor-pointer"
            >
              Credential Updates
            </label>
            <p className="text-sm text-ink-600 mt-1">
              When your credentials are verified or need attention
            </p>
          </div>
        </div>

        {/* Community Activity */}
        <div className="flex items-start gap-4 rounded-lg border border-trades-200 bg-white p-4">
          <input
            type="checkbox"
            id="communityActivity"
            checked={prefs.communityActivity}
            onChange={() => handleToggle('communityActivity')}
            className="mt-1 h-5 w-5 cursor-pointer rounded border-trades-300 text-trades-500"
          />
          <div className="flex-1">
            <label
              htmlFor="communityActivity"
              className="block font-medium text-ink-900 cursor-pointer"
            >
              Community Activity
            </label>
            <p className="text-sm text-ink-600 mt-1">
              Replies and upvotes on your posts
            </p>
          </div>
        </div>

        {/* Marketing */}
        <div className="flex items-start gap-4 rounded-lg border border-trades-200 bg-white p-4">
          <input
            type="checkbox"
            id="marketing"
            checked={prefs.marketing}
            onChange={() => handleToggle('marketing')}
            className="mt-1 h-5 w-5 cursor-pointer rounded border-trades-300 text-trades-500"
          />
          <div className="flex-1">
            <label
              htmlFor="marketing"
              className="block font-medium text-ink-900 cursor-pointer"
            >
              Platform News
            </label>
            <p className="text-sm text-ink-600 mt-1">
              Platform updates and announcements
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="btn-primary w-full min-h-[44px]"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size="sm" />
            Saving...
          </span>
        ) : (
          'Continue'
        )}
      </button>
    </form>
  )
}
