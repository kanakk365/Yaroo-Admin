export interface WithdrawalRequest {
  id: string
  user_id: string
  amount: number
  timestamp: string
  status?: "pending" | "approved" | "rejected"
  payment_method?: string
  payment_details?: string
}

export interface WithdrawalResponse {
  success: boolean
  data: WithdrawalRequest[]
  message: string
}

export interface WithdrawalProps {
  isActive: boolean
}