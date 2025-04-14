import { useState, useEffect } from "react";
import { User } from "./types";
import { uploadFile } from "@/lib/client-upload";
import axios from "axios";
import { apiRoute, getAuthHeaders } from "@/lib/server";

interface NofifyModal {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NotificationData {
  notification_id: string;
  timestamp?: string;
  event_type: string;
  notified_to: string | null;
  triggered_by: string;
  read: boolean;
  name: string;
  description: string;
  media: any[];
  reference_id: string;
  reference_table: string;
}

interface AdminUser {
  email: string;
  name: string;
  phone: string;
  region: string;
  uid: string;
}

export default function NotificationModal({
  user,
  open,
  onOpenChange,
}: NofifyModal) {
  const [notification, setNotification] = useState<{
    name: string;
    description: string;
    media: string[];
    event_type: string;
  }>({
    name: "",
    description: "",
    media: [],
    event_type: "NEW_BOOKING",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string>("");
  
  useEffect(() => {
    try {
      const adminUserString = localStorage.getItem("adminUser");
      if (adminUserString) {
        const adminUser: AdminUser = JSON.parse(adminUserString);
        if (adminUser && adminUser.uid) {
          setAdminId(adminUser.uid);
        }
      }
    } catch (error) {
      console.error("Error retrieving admin user data from localStorage:", error);
    }
  }, []);
  
  if (!open) return null;
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNotification((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = await uploadFile(file);
      if (imageUrl) {
        setNotification((prev) => ({ ...prev, media: [imageUrl] }));
      }
    }
  };

  const onClose = () => {
    setErrorMessage(null);
    onOpenChange(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const userId = user?.id || adminId;

      const now = new Date();
      const formattedTimestamp = now.toISOString().split('.')[0] + 'Z';

      const notificationData: NotificationData = {
        notification_id: "",
        timestamp: formattedTimestamp,
        event_type: notification.event_type,
        notified_to: notification.event_type === "GENERAL" ? null : userId,
        triggered_by: adminId,
        read: false,
        name: notification.name,
        description: notification.description,
        media: notification.media,
        reference_id: adminId,
        reference_table: "users",
      };

      console.log("Sending notification data:", notificationData);

      const response = await axios.post(
        `${apiRoute}/v1/admin/notification/send`,
        notificationData,
        {
          headers: getAuthHeaders(),
          timeout: 10000,
        }
      );

      if (response.data?.success) {
        console.log("Notification sent successfully!");
        setNotification({
          name: "",
          description: "",
          media: [],
          event_type: "NEW_BOOKING",
        });
        onOpenChange(false);
      } else {
        const message = response.data?.message || "Failed to send notification";
        console.log(message);
        setErrorMessage(message);
      }
    } catch (error) {
      console.error("Error sending notification:", error);

      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Response data:", error.response?.data);

        let message = "Failed to send notification";
        
        if (error.response?.status === 500) {
          message = "Server error occurred. The team has been notified.";
        } else if (error.response?.status === 401) {
          message = "Authentication failed. Please log in again.";
        } else if (error.response?.status === 403) {
          message = "You don't have permission to send notifications.";
        } else if (error.response?.status === 400) {
          message = error.response.data?.message || "Invalid notification data";
        } else if (error.code === 'ECONNABORTED') {
          message = "Request timed out. Please try again.";
        }

        console.log("Error details:", error.response?.data?.data);
        console.log("Full error response:", error.response);

        setErrorMessage(message);
      } else {
        console.log("An unexpected error occurred");
        setErrorMessage(
          `An unexpected error occurred: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Create Booking Notification</h2>{" "}
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notification Name
            </label>{" "}
            <input
              onChange={(e) => handleInputChange(e)}
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter notification name"
              value={notification.name}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>{" "}
            <textarea
              onChange={(e) => handleInputChange(e)}
              id="description"
              name="description"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter notification description"
              value={notification.description}
              required
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="event_type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Type
            </label>
            <select
              onChange={(e) =>
                setNotification((prev) => ({
                  ...prev,
                  event_type: e.target.value,
                }))
              }
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
            <label
              htmlFor="media"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Image
            </label>{" "}
            <input
              onChange={handleFileChange}
              type="file"
              id="media"
              name="media"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {notification.media.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-green-600">
                  Image uploaded successfully
                </p>
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
              disabled={isSubmitting}
              className={`px-4 py-2 bg-[#4fb372] text-white rounded-md hover:bg-[#3d9059] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Notification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
