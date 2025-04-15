"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"
import { Phone } from "lucide-react"

export default function Login() {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { loginWithPhone, verifyOtp } = useAuth()

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!otpSent) {
        await loginWithPhone(phone)
        setOtpSent(true)
        setError("OTP sent successfully")
      } else {
        const result = await verifyOtp(phone, otp, rememberMe)
        
        if (!result.accountExists) {
          setError("No admin account found with this phone number. Please register first.")
          return
        }
        
        setError("Login successful! Redirecting to dashboard...")
      }
    } catch (err: unknown) {
      setError(err instanceof Error 
        ? err.message 
        : err && typeof err === 'object' && 'response' in err 
          ? typeof err.response === 'object' && err.response !== null && 'data' in err.response 
            ? typeof err.response.data === 'object' && err.response.data !== null && 'message' in err.response.data && typeof err.response.data.message === 'string'
              ? err.response.data.message
              : "Authentication failed. Please try again."
            : "Authentication failed. Please try again."
          : "Authentication failed. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    try {
      await loginWithPhone(phone)
      setError("OTP sent successfully")
    } catch (err: unknown) {
      setError(err instanceof Error 
        ? err.message 
        : err && typeof err === 'object' && 'response' in err 
          ? typeof err.response === 'object' && err.response !== null && 'data' in err.response 
            ? typeof err.response.data === 'object' && err.response.data !== null && 'message' in err.response.data && typeof err.response.data.message === 'string'
              ? err.response.data.message
              : "Failed to send OTP. Please try again."
            : "Failed to send OTP. Please try again."
          : "Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetOtpFlow = () => {
    setOtpSent(false)
    setOtp("")
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#4FB372] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-3xl">A</span>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Admin Dashboard</CardTitle>
            <CardDescription className="text-center">Login to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className={`p-3 rounded-md mb-4 text-sm ${error.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                {error}
              </div>
            )}

            <form onSubmit={handlePhoneSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>Phone Number</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91xxxxxxxxxx"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      if (otpSent) resetOtpFlow()
                    }}
                    required
                    disabled={otpSent && isLoading}
                  />
                </div>

                {otpSent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="otp">OTP</Label>
                      <button 
                        type="button" 
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        className="text-sm text-[#4FB372] hover:underline disabled:text-gray-400"
                      >
                        Resend OTP
                      </button>
                    </div>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={6}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-phone"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember-phone" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>

                <Button type="submit" className="w-full bg-[#4FB372] hover:bg-[#3d9059]" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {otpSent ? "Verifying..." : "Sending OTP..."}
                    </>
                  ) : (
                    otpSent ? "Verify OTP" : "Send OTP"
                  )}
                </Button>

                {otpSent && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={resetOtpFlow}
                    disabled={isLoading}
                  >
                    Change Phone Number
                  </Button>
                )}
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/register" className="text-[#4FB372] hover:underline text-sm">
                Don`&apos;t have an admin account? Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

