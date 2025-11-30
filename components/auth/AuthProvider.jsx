'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInAnonymously,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    
    return unsubscribe
  }, [])
  
  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address format.'
      case 'auth/user-disabled':
        return 'This account has been disabled.'
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.'
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.'
      case 'auth/operation-not-allowed':
        return 'Operation not allowed. Please contact support.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.'
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }
  
  // Sign in with email/password
  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: getFriendlyErrorMessage(error.code) }
    }
  }
  
  // Sign up with email/password
  const signUp = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (name) {
        await updateProfile(result.user, { displayName: name })
        // Force update user state to reflect the new display name
        setUser({ ...result.user, displayName: name })
      }
      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: getFriendlyErrorMessage(error.code) }
    }
  }
  
  // Sign in anonymously (for guests)
  const signInAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth)
      return { success: true, user: result.user }
    } catch (error) {
      return { success: false, error: getFriendlyErrorMessage(error.code) }
    }
  }
  
  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: getFriendlyErrorMessage(error.code) }
    }
  }
  
  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInAsGuest,
    signOut,
  }
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
