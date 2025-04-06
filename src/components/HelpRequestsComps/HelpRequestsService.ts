import axios from "axios";
import { HelpRequest, HelpRequestResponse } from "./types";

const API_BASE_URL = "https://yaro-6000-karma.offline.coffeecodes.in/v1/admin";
const AUTH_TOKEN = "sdbsdbjdasdabhjbjahbjbcj8367";

export const HelpRequestsService = {
  getHelpRequests: async (): Promise<HelpRequest[]> => {
    try {
      const response = await axios.get<HelpRequestResponse>(
        `${API_BASE_URL}/help`,
        {
          headers: {
            "X-Karma-Admin-Auth": AUTH_TOKEN,
          },
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
        headers: {
          "X-Karma-Admin-Auth": AUTH_TOKEN,
        },
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
