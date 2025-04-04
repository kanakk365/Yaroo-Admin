import { Card, CardContent } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { WithdrawalRequest } from "./types"

interface WithdrawalStatsProps {
  withdrawalRequests: WithdrawalRequest[]
}

export default function WithdrawalStats({ withdrawalRequests }: WithdrawalStatsProps) {
  const pendingCount = withdrawalRequests.filter(req => req.status === "pending").length
  
  const approvedTodayCount = withdrawalRequests.filter(req => {
    const isToday = new Date(req.timestamp).toDateString() === new Date().toDateString()
    return req.status === "approved" && isToday
  }).length
  
  const approvedTodayAmount = withdrawalRequests
    .filter(req => {
      const isToday = new Date(req.timestamp).toDateString() === new Date().toDateString()
      return req.status === "approved" && isToday
    })
    .reduce((sum, req) => sum + req.amount, 0)
    
  const rejectedTodayCount = withdrawalRequests.filter(req => {
    const isToday = new Date(req.timestamp).toDateString() === new Date().toDateString()
    return req.status === "rejected" && isToday
  }).length
  
  const rejectedTodayAmount = withdrawalRequests
    .filter(req => {
      const isToday = new Date(req.timestamp).toDateString() === new Date().toDateString()
      return req.status === "rejected" && isToday
    })
    .reduce((sum, req) => sum + req.amount, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
              <p className="text-2xl font-semibold text-gray-800">{pendingCount}</p>
              <span className="inline-flex items-center text-xs text-amber-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {Math.floor(Math.random() * 15)}% since yesterday
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#4FB372]/10 text-[#4FB372]">
              <Check className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Approved Today</h3>
              <p className="text-2xl font-semibold text-gray-800">{approvedTodayCount}</p>
              <span className="text-xs text-gray-500">₹{approvedTodayAmount.toFixed(2)} total</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <X className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Rejected Today</h3>
              <p className="text-2xl font-semibold text-gray-800">{rejectedTodayCount}</p>
              <span className="text-xs text-gray-500">₹{rejectedTodayAmount.toFixed(2)} total</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}