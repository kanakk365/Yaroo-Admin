import { useState, useEffect } from "react"
import { HelpRequest } from "../HelpRequestsComps/types"
import { HelpRequestsService } from "../HelpRequestsComps/HelpRequestsService"
import HelpRequestsHeader from "../HelpRequestsComps/HelpRequestsHeader"
import HelpRequestsStats from "../HelpRequestsComps/HelpRequestsStats"
import HelpRequestsTable from "../HelpRequestsComps/HelpRequestsTable"
import ViewHelpRequestModal from "../HelpRequestsComps/ViewHelpRequestModal"

interface HelpRequestsProps {
  isActive: boolean
}

export default function HelpRequests({ isActive }: HelpRequestsProps) {
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    if (!isActive) return
    
    const fetchHelpRequests = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const requests = await HelpRequestsService.getHelpRequests()
        setHelpRequests(requests)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
        setError(errorMessage)
        console.error("Error fetching help requests:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchHelpRequests()
  }, [isActive])
  
  const handleDeleteHelpRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this help request?")) {
      return
    }
    
    setIsDeleting(true)
    try {
      const success = await HelpRequestsService.deleteHelpRequest(requestId)
      
      if (success) {
        setHelpRequests(prev => prev.filter(request => request.id !== requestId))
        alert("Help request deleted successfully!")
      } else {
        alert("Failed to delete help request")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      alert(`Error deleting help request: ${errorMessage}`)
      console.error("Error deleting help request:", err)
    } finally {
      setIsDeleting(false)
    }
  }
  
  const handleViewHelpRequest = (request: HelpRequest) => {
    setSelectedRequest(request)
    setIsViewModalOpen(true)
  }
  
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedRequest(null)
  }
  
  const filteredRequests = helpRequests.filter(request => {
    const matchesFilter = filter === "all" || request.status === filter
    const matchesSearch = searchQuery === "" || 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesSearch
  })
  
  const totalRequests = helpRequests.length
  const pendingRequests = helpRequests.filter(req => req.status === "pending").length
  const resolvedRequests = helpRequests.filter(req => req.status === "resolved").length

  if (!isActive) return null

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <HelpRequestsHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilter={setFilter}
        />

        <HelpRequestsStats
          totalRequests={totalRequests}
          pendingRequests={pendingRequests}
          resolvedRequests={resolvedRequests}
        />

        <HelpRequestsTable
          helpRequests={filteredRequests}
          isLoading={isLoading}
          error={error}
          isDeleting={isDeleting}
          totalRequests={totalRequests}
          onDeleteRequest={handleDeleteHelpRequest}
          onViewRequest={handleViewHelpRequest}
        />
        
        <ViewHelpRequestModal
          helpRequest={selectedRequest}
          isVisible={isViewModalOpen}
          onClose={handleCloseViewModal}
        />
      </div>
    </div>
  )
}

