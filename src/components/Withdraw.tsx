import { useState, useEffect } from "react"
import WithdrawalHeader from "./WithdrawComps/WithdrawalHeader"
import WithdrawalStats from "./WithdrawComps/WithdrawalStats"
import WithdrawalTable from "./WithdrawComps/WithdrawalTable"
import { WithdrawalRequest, WithdrawalProps } from "./WithdrawComps/types"
import { fetchWithdrawalRequests } from "./WithdrawComps/WithdrawalService"

export default function Withdrawal({ isActive }: WithdrawalProps) {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  
  useEffect(() => {
    if (isActive) {
      handleFetchWithdrawalRequests()
    }
  }, [isActive])
  
  const handleFetchWithdrawalRequests = async () => {
    setLoading(true)
    
    const { withdrawals, error } = await fetchWithdrawalRequests()
    
    setWithdrawalRequests(withdrawals)
    setError(error)
    setLoading(false)
  }
  
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
  }
  
  if (!isActive) return null

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <WithdrawalHeader onStatusFilterChange={handleStatusFilter} />
        
        <WithdrawalStats withdrawalRequests={withdrawalRequests} />
        
        <WithdrawalTable 
          withdrawalRequests={withdrawalRequests}
          loading={loading}
          error={error}
          onRetry={handleFetchWithdrawalRequests}
          statusFilter={statusFilter}
        />
      </div>
    </div>
  )
}

