import { useState } from "react"
import { User } from "./types"
import { uploadFile } from "@/lib/client-upload"
import axios from "axios"





interface NofifyModal {
    user: User | null,
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function NotificationModal({ user, open, onOpenChange }: NofifyModal) {
    if (!open) return null     
     const [notification, setNotification] = useState<{
        notification_id: string;
        timestamp: string;
        name: string;
        description: string;
        media: string[];
        event_type: string;
        notified_to: string | undefined;
        triggered_by: string;
        read: boolean;
        reference_id: string;
        reference_table: string;
    }>({
        notification_id: `ntf_${Math.random().toString(36).substring(2, 15)}`,
        timestamp: new Date().toISOString(),
        name: "",
        description: "",
        media: [],
        event_type: "NEW_BOOKING",
        notified_to: user?.id,
        triggered_by: "admin",
        read: false,
        reference_id: user?.id || "admin",
        reference_table: "providers"
    })

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNotification((prev)=> ({...prev , [e.target.name]:e.target.value }) )
    }    
     const handleFileChange = async (e:React.ChangeEvent<HTMLInputElement>)=>{        if(e.target.files && e.target.files[0]){
            const file = e.target.files[0]
           const imageUrl = await uploadFile(file)
           if (imageUrl) {
               setNotification((prev) => ({ ...prev, media: [imageUrl] }));
           }
        }
    }

    const onClose = () => {
        onOpenChange(false)
    }      
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            const notificationData = {
                ...notification,
                timestamp: new Date().toISOString(),
                media: notification.media.length > 0 ? notification.media : [],
                reference_table: "providers"
            };
            
            console.log("Sending notification data:", notificationData);
            
            const response = await axios.post(
                'https://yaro-6000-karma.offline.coffeecodes.in/v1/admin/notification/send', 
                notificationData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Karma-Admin-Auth': 'sdbsdbjdasdabhjbjahbjbcj8367'
                    }
                }
            );
            
            if (response.status === 200) {
                console.log("Notification sent successfully!");
                setNotification({
                    notification_id: `ntf_${Math.random().toString(36).substring(2, 15)}`,
                    timestamp: new Date().toISOString(),
                    name: "",
                    description: "",
                    media: [],
                    event_type: "NEW_BOOKING",
                    notified_to: user?.id,
                    triggered_by: "admin",
                    read: false,
                    reference_id: user?.id || "admin",
                    reference_table: "providers"
                });
                onOpenChange(false);
            } else {
                console.log(response.data?.message || "Failed to send notification");
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 
                                    error.message || 
                                    "Failed to send notification";
                console.log(typeof errorMessage === 'string' ? errorMessage : "Server error");

                alert(`Error: ${typeof errorMessage === 'string' ? errorMessage : "Server error"}`);
            } else {
                console.log("An unexpected error occurred");
                alert("An unexpected error occurred");
            }
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-bold mb-4">Create Booking Notification</h2>                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Notification Name
                        </label>                        <input
                            onChange={(e)=>handleInputChange(e)}
                            type="text"
                            id="name"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="Enter notification name"
                            value={notification.name}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>                        <textarea
                            onChange={(e)=>handleInputChange(e)}
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="Enter notification description"
                            value={notification.description}
                        ></textarea>
                    </div>
                    
                    <div>
                        <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-1">
                            Event Type
                        </label>
                        <select
                            onChange={(e) => setNotification(prev => ({ ...prev, event_type: e.target.value }))}
                            id="event_type"
                            name="event_type"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={notification.event_type}
                        >
                            <option value="NEW_BOOKING">New Booking</option>
                            <option value="BOOKING_CONFIRMED">Booking Confirmed</option>
                            <option value="BOOKING_CANCELLED">Booking Cancelled</option>
                            <option value="GENERAL">General</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Image
                        </label>                        <input
                            onChange={handleFileChange}
                            type="file"
                            id="media"
                            name="media"
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        {notification.media.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-green-600">Image uploaded successfully</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#4fb372] text-white rounded-md hover:bg-[#3d9059] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Send Notification
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
