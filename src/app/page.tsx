"use client"
import { useRouter } from "next/navigation"
import Login from "@/components/Login"
import Dashboard from "@/components/DashboardWrapper"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-[#4FB372] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />
  }

  // Show dashboard if authenticated
  return <Dashboard />
}

