import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, Bell } from "lucide-react"
import { User, UserStatsData } from "./types"
import { useState } from "react"
import UserDetailsModal from "./UserDetailsModal"
import NotificationModal from "./NoficationModal"



interface UserTableProps {
  statsData: UserStatsData | null;
}

export default function UserTable({ statsData }: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [ notifyModalOpen, setNotifyModalOpen] = useState(false)
  const itemsPerPage = 10
  
  const filteredUsers = statsData?.users.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm)
      
    return matchesSearch
  }) || []
  
  const totalUsers = filteredUsers.length
  const totalPages = Math.ceil(totalUsers / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setModalOpen(true)
  }

  const handleNotifyUser= (user:User)=>{
    setSelectedUser(user)
    setNotifyModalOpen(true)
    console.log(notifyModalOpen)
  }

  return (
    <>
      <Card className="overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">Recent Users</h3>
            <div className="flex items-center">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search users..." 
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
        </div>

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
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Wallet Balance
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
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="text-xs text-gray-500">{user.email || "No email provided"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email || "No email"}</div>
                      <div className="text-xs text-gray-500">{user.phone || "No phone"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="mr-2">₹{user.wallet_balance}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-[#4FB372] hover:text-[#3d9059]" 
                          title="View User Details"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button 
                          className="text-[#4FB372] hover:text-[#3d9059]" 
                          title="View User Details"
                          onClick={() => handleNotifyUser(user)}
                        >
                          <Bell className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span>
              Showing {totalUsers > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, totalUsers)} of {totalUsers} users
            </span>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            {totalPages <= 5 ? (
              Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button 
                  key={page} 
                  variant="outline" 
                  className={page === currentPage ? "bg-[#4FB372] text-white hover:bg-[#3d9059]" : ""}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className={currentPage === 1 ? "bg-[#4FB372] text-white hover:bg-[#3d9059]" : ""}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </Button>
                
                {currentPage > 3 && <Button variant="outline" disabled>...</Button>}
                
                {Array.from(
                  { length: Math.min(3, totalPages - 2) },
                  (_, i) => {
                    let pageNum;
                    if (currentPage <= 2) {
                      pageNum = i + 2;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 3 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    return pageNum > 1 && pageNum < totalPages ? (
                      <Button 
                        key={pageNum} 
                        variant="outline" 
                        className={pageNum === currentPage ? "bg-[#4FB372] text-white hover:bg-[#3d9059]" : ""}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    ) : null;
                  }
                )}
                
                {currentPage < totalPages - 2 && <Button variant="outline" disabled>...</Button>}
                
                <Button 
                  variant="outline" 
                  className={currentPage === totalPages ? "bg-[#4FB372] text-white hover:bg-[#3d9059]" : ""}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
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
      
      <UserDetailsModal 
        user={selectedUser} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
      <NotificationModal
      user={selectedUser} 
      open={notifyModalOpen} 
      onOpenChange={setNotifyModalOpen} 
      />
    </>
  )
}