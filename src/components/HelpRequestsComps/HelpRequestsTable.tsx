import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Trash2, User } from "lucide-react"
import { HelpRequest } from "./types"
import { formatDate } from "./HelpRequestsService"
import { useState } from "react"

interface HelpRequestsTableProps {
  helpRequests: HelpRequest[];
  isLoading: boolean;
  error: string | null;
  isDeleting: boolean;
  totalRequests: number;
  onDeleteRequest: (requestId: string) => void;
  onViewRequest: (request: HelpRequest) => void;
}

export default function HelpRequestsTable({
  helpRequests,
  isLoading,
  error,
  isDeleting,
  totalRequests,
  onDeleteRequest,
  onViewRequest
}: HelpRequestsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalRequests / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, helpRequests.length);
  const currentRequests = helpRequests.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <Card className="overflow-hidden mb-8">
      <div className="border-b border-gray-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">Recent Contact Requests</h3>
          <Button className="bg-[#4FB372] hover:bg-[#3d9059]">Export Data</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading help requests...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
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
                  <div className="flex items-center">
                    <Checkbox id="selectAll" />
                    <label htmlFor="selectAll" className="sr-only">
                      Select All
                    </label>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID/User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title/Message
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
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
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No help requests found
                  </td>
                </tr>
              ) : (
                currentRequests.map((request) => {
                  const formattedDate = formatDate(request.created_at);
                  return (
                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Checkbox id={`request-${request.id}`} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <User className="h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{request.id.substring(0, 8)}</div>
                            <div className="text-sm text-gray-500">{request.user_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 mb-1">{request.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {request.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span>{formattedDate.date}</span>
                        <span className="block text-xs">{formattedDate.time}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'resolved' 
                            ? 'bg-green-100 text-green-800' 
                            : request.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}>
                          {request.status === 'in_progress' ? 'In Progress' : 
                           request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="text-[#4FB372] hover:text-[#3d9059]"
                            onClick={() => onViewRequest(request)}
                            title="View details"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => onDeleteRequest(request.id)}
                            disabled={isDeleting}
                            title="Delete request"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <span>
            {totalRequests > 0 
              ? `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, totalRequests)} of ${totalRequests} requests`
              : "No requests to display"}
          </span>
        </div>
        <div className="flex space-x-1">
          <Button 
            variant="outline" 
            disabled={currentPage === 1 || totalPages === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          
          {getPageNumbers().map((page, index) => (
            typeof page === 'number' ? (
              <Button 
                key={index}
                variant="outline" 
                className={currentPage === page 
                  ? "bg-[#4FB372] text-white hover:bg-[#3d9059]" 
                  : ""}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="self-center px-2">
                {page}
              </span>
            )
          ))}
          
          <Button 
            variant="outline" 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}