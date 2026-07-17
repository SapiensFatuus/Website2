/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '../firebase'
import { getAuthStatus } from './authState'

const AuthContext = createContext(null)

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

function getAuthErrorMessage(error) {
  if (!error?.code) {
    return 'Sign-in did not finish. Please try again.'
  }

  if (
    error.code === 'auth/popup-closed-by-user'
    || error.code === 'auth/cancelled-popup-request'
  ) {
    return 'Sign-in was canceled.'
  }

  if (error.code === 'auth/popup-blocked') {
    return 'Your browser blocked the sign-in popup. Allow popups and try again.'
  }

  return 'Sign-in did not finish. Please try again.'
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let isMounted = true

    void setPersistence(auth, browserLocalPersistence).catch(() => {})

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (!isMounted) {
        return
      }

      setUser(nextUser)
      setIsReady(true)
      setIsAuthenticating(false)
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  async function signIn() {
    setAuthError('')
    setIsAuthenticating(true)

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      setAuthError(getAuthErrorMessage(error))
      setIsAuthenticating(false)
    }
  }

  async function signOut() {
    setAuthError('')

    try {
      await firebaseSignOut(auth)
    } catch {
      setAuthError('Sign-out did not finish. Please try again.')
    }
  }

  const value = useMemo(() => ({
    user,
    isReady,
    isAuthenticating,
    authError,
    authStatus: getAuthStatus(user, isReady),
    signIn,
    signOut,
    clearAuthError: () => setAuthError(''),
  }), [authError, isAuthenticating, isReady, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)

  if (!value) {
    throw new Error('useAuth must be used within an AuthProvider.')
  }

  return value
}
