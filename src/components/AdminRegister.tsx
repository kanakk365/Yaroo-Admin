"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"

export default function AdminRegister() {
  const router = useRouter()
  const { registerAdmin, loginWithPhone, verifyOtp } = useAuth()
  
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [token, setToken] = useState("")
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [dob, setDob] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const FIXED_REGION_ID = "-6k3cvb3xs"

  const generateUniqueId = () => {
    return `user_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  }

  const formatDateForBackend = (date: string) => {
    if (!date) return ""
    const [year, month, day] = date.split("-")
    return `${day}-${month}-${year}`
  }

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
        const result = await verifyOtp(phone, otp, true)
        
        if (result.accountExists) {
          setError("An account with this phone number already exists. Redirecting to login...")
          setTimeout(() => router.push("/"), 2000)
          return
        }
        
        setToken(result.token)
        setPhoneVerified(true)
        setError("Phone verified successfully! Please complete registration.")
      }
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK') {
        setError("Network Error: Unable to connect to the authentication service. Please check your internet connection and try again.")
      } else {
        setError(err.response?.data?.message || err.message || "Authentication failed. Please try again.")
      }
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
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetOtpFlow = () => {
    setOtpSent(false)
    setOtp("")
    setError("")
  }

  const validateRegistrationForm = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    
    if (!dob) {
      setError("Date of birth is required")
      return false
    }
    
    return true
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!validateRegistrationForm()) {
      return
    }
    
    setIsLoading(true)

    try {
      const formattedDob = formatDateForBackend(dob)
      const uniqueId = generateUniqueId()
      
      const registerData = {
        id: uniqueId,
        username,
        password,
        email,
        address,
        dob: formattedDob,
        region: FIXED_REGION_ID,
        referral_code: referralCode || undefined
      }
      
      await registerAdmin(registerData)
      setError("Registration successful! Redirecting to login...")
      
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
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
            <CardTitle className="text-2xl font-bold text-center">Admin Registration</CardTitle>
            <CardDescription className="text-center">
              {phoneVerified 
                ? "Complete your admin registration" 
                : "Verify your phone number to register as admin"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className={`p-3 rounded-md mb-4 text-sm ${error.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                {error}
              </div>
            )}

            {!phoneVerified ? (
              <form onSubmit={handlePhoneSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
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
            ) : (
              <form onSubmit={handleRegisterSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth (DD-MM-YYYY)</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">Format: DD-MM-YYYY</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                    <Input
                      id="referralCode"
                      placeholder="Referral code (if any)"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-[#4FB372] hover:bg-[#3d9059]" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Registering...
                      </>
                    ) : (
                      "Register as Admin"
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <a href="/" className="text-[#4FB372] hover:underline text-sm">
                      Already have an account? Login
                    </a>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}