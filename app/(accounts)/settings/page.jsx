'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleUpdateProfile = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName })
        setMessage('Profile updated successfully!')
        setError('')
      }
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  const handleUpdatePassword = async () => {
    try {
      if (auth.currentUser && newPassword) {
        await updatePassword(auth.currentUser, newPassword)
        setMessage('Password updated successfully!')
        setError('')
        setNewPassword('')
      }
    } catch (err) {
      setError(err.message)
      setMessage('')
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      if (auth.currentUser) {
        await deleteUser(auth.currentUser)
        setMessage('Account deleted successfully.')
        setError('')
        // Optionally, redirect or sign out
      }
    } catch (err) {
      setError(err.message)
      setMessage('')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  // Mock history data
  const history = [
  ]

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-white">Account Settings</h1>
      
      {message && (
        <div className="mb-6 rounded-lg bg-green-900/50 p-4 text-green-200 border border-green-800">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-6 rounded-lg bg-red-900/50 p-4 text-red-200 border border-red-800">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">Display Name</label>
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="Your Name"
              />
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleUpdateProfile}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Security</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-400">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-2 text-white focus:border-blue-500 focus:outline-none pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleUpdatePassword}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Viewing History</h2>
          <div className="space-y-3">
            {history.map((item) => (
              <Link 
                key={item.id} 
                href={`/articles/${item.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-3 transition-colors hover:border-blue-500/50"
              >
                <div className="truncate pr-4">
                  <h4 className="truncate text-sm font-medium text-white">{item.title}</h4>
                  <p className="text-xs text-gray-500">arXiv:{item.id}</p>
                </div>
                <span className="shrink-0 text-xs text-gray-500">{item.date}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Delete Account</h2>
          <button
            className="w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
          >
            Delete Account
          </button>
        </div>

        {/* Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 max-w-sm w-full text-center">
              <h3 className="text-xl font-bold text-white mb-4">Are you sure?</h3>
              <p className="text-gray-400 mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
              <div className="flex gap-4 justify-center">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}