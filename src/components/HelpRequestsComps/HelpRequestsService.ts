import axios from "axios";
import { HelpRequest, HelpRequestResponse } from "./types";
import { apiRoute, getAuthHeaders } from "../../lib/server"

const API_BASE_URL = `${apiRoute}/v1/admin`;

export const HelpRequestsService = {
  getHelpRequests: async (): Promise<HelpRequest[]> => {
    try {
      const response = await axios.get<HelpRequestResponse>(
        `${API_BASE_URL}/help`,
        {
          headers: getAuthHeaders()
        },
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch help requests",
        );
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "An unexpected error occurred";

      throw new Error(errorMessage);
    }
  },

  deleteHelpRequest: async (requestId: string): Promise<boolean> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/help/${requestId}`, {
        headers: getAuthHeaders()
      });

      return response.data.success;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : err instanceof Error
          ? err.message
          : "An unexpected error occurred";

      throw new Error(errorMessage);
    }
  },
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return {
      date: "Today",
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  } else if (date.toDateString() === yesterday.toDateString()) {
    return {
      date: "Yesterday",
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  } else {
    return {
      date: date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }
};
