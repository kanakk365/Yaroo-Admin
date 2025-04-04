import { useState } from "react"
import { User } from "./types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { formatDate } from "@/lib/utils"

interface UserDetailsModalProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UserDetailsModal({ user, open, onOpenChange }: UserDetailsModalProps) {
  if (!user) return null

  const formatDob = (dobString: string) => {
    if (!dobString || dobString === "0001-01-01T00:00:00Z") return "Not provided"
    return formatDate(new Date(dobString))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">User Details</DialogTitle>
          <DialogDescription>
            Comprehensive information about the user
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-3xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Username</h3>
              <p className="text-base text-gray-900">{user.username}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">User ID</h3>
              <p className="text-base text-gray-900 break-all">{user.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-base text-gray-900">{user.email || "Not provided"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="text-base text-gray-900">{user.phone || "Not provided"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
              <p className="text-base text-gray-900">{formatDob(user.dob || "")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Region</h3>
              <p className="text-base text-gray-900">{user.region || "Not specified"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="text-base text-gray-900">{user.address || "Not provided"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Financial Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-medium text-gray-500">Wallet Balance</h4>
                <p className="text-base font-semibold text-gray-900">₹{user.wallet_balance}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500">Total Cashback</h4>
                <p className="text-base font-semibold text-gray-900">₹{user.total_cashback}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500">Completed Cashback</h4>
                <p className="text-base font-semibold text-gray-900">₹{user.completed_cashback || 0}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-500">Pending Cashback</h4>
                <p className="text-base font-semibold text-gray-900">₹{user.pending_cashback || 0}</p>
              </div>
            </div>
          </div>

          {user.referral_code && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Referral Code</h3>
              <p className="text-base text-gray-900">{user.referral_code}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}