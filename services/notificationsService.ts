import apiClient, { handleApiError } from "./apiClient";

export interface Notification {
  id: number;
  notification_type: "seasonal" | "product";
  title: string;
  display_message: string;
  is_read: boolean;
  is_important: boolean;
  priority: "low" | "medium" | "high";
  time_ago: string;
  can_dismiss: boolean;
}

export interface NotificationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Notification[];
}



const notificationsService = {
  getNotifications: async (): Promise<NotificationsResponse> => {
    try {
      const { data } = await apiClient.get<NotificationsResponse>(
        "/notifications/"
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to load notifications.");
    }
  },
};

export default notificationsService;

