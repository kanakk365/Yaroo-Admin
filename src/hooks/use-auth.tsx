"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  loading: boolean
  user: { email: string; name: string } | null
  login: (email: string, password: string, remember?: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("adminUser")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          console.error("Error parsing stored user data:", error)
          localStorage.removeItem("adminUser")
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string, remember = false) => {
    // In a real app, you would validate credentials with an API
    // For this example, we'll simulate a successful login

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = { email, name: "Admin User" }
    setUser(userData)
    setIsAuthenticated(true)

    if (remember) {
      localStorage.setItem("adminUser", JSON.stringify(userData))
    } else {
      // For session-only storage, we could use sessionStorage instead
      // but for simplicity, we'll still use localStorage
      localStorage.setItem("adminUser", JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("adminUser")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

