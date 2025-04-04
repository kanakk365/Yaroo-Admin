import { HelpRequest } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { formatDate } from "./HelpRequestsService";

interface ViewHelpRequestModalProps {
  helpRequest: HelpRequest | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function ViewHelpRequestModal({ 
  helpRequest, 
  isVisible, 
  onClose 
}: ViewHelpRequestModalProps) {
  if (!isVisible || !helpRequest) return null;
  
  const formattedDate = formatDate(helpRequest.created_at);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Help Request Details</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Request ID</h4>
              <p className="text-gray-900">{helpRequest.id}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">User ID</h4>
              <p className="text-gray-900">{helpRequest.user_id}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Title</h4>
              <p className="text-gray-900 font-medium">{helpRequest.title}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
              <div className="p-4 bg-gray-50 rounded-md text-gray-800">
                {helpRequest.description}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Date</h4>
                <p className="text-gray-900">{formattedDate.date} at {formattedDate.time}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  helpRequest.status === 'resolved' 
                    ? 'bg-green-100 text-green-800' 
                    : helpRequest.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                }`}>
                  {helpRequest.status === 'in_progress' ? 'In Progress' : 
                  helpRequest.status.charAt(0).toUpperCase() + helpRequest.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Callback Requested</h4>
              <p className="text-gray-900">{helpRequest.is_callback ? "Yes" : "No"}</p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}