import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Check, X, Eye } from "lucide-react"
import { WithdrawalRequest } from "./types"
import { formatDate, formatTime } from "./WithdrawalService"
import { useState } from "react"

interface WithdrawalTableProps {
  withdrawalRequests: WithdrawalRequest[]
  loading: boolean
  error: string | null
  onRetry: () => void
  statusFilter: string
}

export default function WithdrawalTable({ 
  withdrawalRequests, 
  loading, 
  error, 
  onRetry,
  statusFilter
}: WithdrawalTableProps) {
  const filteredRequests = statusFilter === "all" 
    ? withdrawalRequests 
    : withdrawalRequests.filter(req => req.status === statusFilter)

  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10
  
  const searchFilteredRequests = searchTerm 
    ? filteredRequests.filter(req => 
        req.user_id.toString().includes(searchTerm) || 
        req.amount.toString().includes(searchTerm))
    : filteredRequests
    
  const totalPages = Math.ceil(searchFilteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  
  const currentRequests = searchFilteredRequests.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">Withdrawal Requests</h3>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search requests..." 
              className="w-64 pl-10 pr-4 py-2" 
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading withdrawal requests...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={onRetry} className="mt-4">Retry</Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Request Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                currentRequests.map((request) => (
                  <tr key={request.id} className={`hover:bg-gray-50 transition-colors ${
                    request.status === 'approved' || request.status === 'rejected' ? 'bg-gray-50' : ''
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">User</div>
                          <div className="text-xs text-gray-500">ID: #{request.user_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{request.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-sm text-gray-900">{formatDate(request.timestamp)}</div>
                      <div className="text-xs text-gray-500">{formatTime(request.timestamp)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        request.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status === 'pending' ? 'Pending' : request.status === 'approved' ? 'Approved' : 'Rejected'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className={`p-1 rounded-full ${
                            request.status === 'pending' 
                              ? 'bg-[#4FB372] text-white hover:bg-[#3d9059]' 
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          } transition-colors`}
                          disabled={request.status !== 'pending'}
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button 
                          className={`p-1 rounded-full ${
                            request.status === 'pending' 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          } transition-colors`}
                          disabled={request.status !== 'pending'}
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <button className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, searchFilteredRequests.length)} of {searchFilteredRequests.length} requests</span>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button 
              key={page} 
              variant="outline" 
              className={page === currentPage ? "bg-[#4FB372] text-white hover:bg-[#3d9059]" : ""}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button 
            variant="outline" 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  )
}