import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface HelpRequestsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: string) => void;
}

export default function HelpRequestsHeader({ 
  searchQuery, 
  setSearchQuery, 
  setFilter 
}: HelpRequestsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Help &amp; Contact Requests</h2>
        <p className="text-gray-600 mt-1">Manage user support queries and contact messages</p>
      </div>
      <div className="mt-4 md:mt-0 flex items-center space-x-3">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Search requests..." 
            className="w-full pl-10 pr-4 py-2" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <Select 
          defaultValue="all" 
          onValueChange={(value) => setFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Requests" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}