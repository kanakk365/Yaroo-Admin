import axios from "axios"
import { WithdrawalResponse, WithdrawalRequest } from "./types"

export const fetchWithdrawalRequests = async (): Promise<{
  withdrawals: WithdrawalRequest[];
  error: string | null;
}> => {
  try {
    const response = await axios.get<WithdrawalResponse>(
      "http://localhost:3000/v1/admin/withdrawals",
      {
        headers: {
          "X-Karma-Admin-Auth": "sdbsdbjdasdabhjbjahbjbcj8367"
        }
      }
    )
    
    if (response.data.success) {
      const withdrawals = response.data.data.map(withdrawal => ({
        ...withdrawal,
        status: Math.random() > 0.3 ? "pending" as "pending" : Math.random() > 0.5 ? "approved" as "approved" : "rejected" as "rejected",
        payment_method: ["Bank Transfer", "PayPal", "Crypto"][Math.floor(Math.random() * 3)],
        payment_details: ["HDFC Bank", "user@example.com", "Bitcoin (BTC)"][Math.floor(Math.random() * 3)]
      }))
      
      return { withdrawals, error: null }
    } else {
      return { 
        withdrawals: [], 
        error: response.data.message || "Failed to fetch withdrawal requests" 
      }
    }
  } catch (err) {
    console.error("Error fetching withdrawal requests:", err)
    return { 
      withdrawals: [], 
      error: "Error connecting to the server. Please try again later." 
    }
  }
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}