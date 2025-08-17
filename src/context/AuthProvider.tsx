// src/context/AuthProvider.tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import type { AuthContextValue } from '../types'
import { login as apiLogin, registerUser as apiRegister, logout as apiLogout } from '../api'

type Credentials = { username: string; password: string }
type RegisterPayload = { username: string; password: string; email?: string }

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initial state from localStorage 
  const [username, setUsername] = useState<string | null>(() => {
    const v = localStorage.getItem('username')
    return v && v !== 'null' ? v : null
  })
  const [token, setToken] = useState<string | null>(() => {
    const v = localStorage.getItem('token')
    return v && v !== 'null' ? v : null
  })

  
  useEffect(() => {
    if (username) localStorage.setItem('username', username)
    else localStorage.removeItem('username')
  }, [username])

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  // Actions
  const login = useCallback(async (u: Credentials['username'], p: Credentials['password']) => {
    const data = await apiLogin(u, p)
    setUsername(data.username)
    setToken(data.token)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const data = await apiRegister(payload)
    setUsername(data.username)
    setToken(data.token)
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      
      setUsername(null)
      setToken(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    username,
    token,
    login,
    register,
    logout,
  }), [username, token, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
