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

export interface NotificationStats {
  total_count: number;
  unread_count: number;
  important_count: number;
  by_type: {
    system: number;
    tip: number;
    product: number;
  };
  recent_count: number;
  a_des_non_lues: boolean;
}

export interface BulkActionResponse {
  message: string;
  affected_count: number;
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

  getNotificationStats: async (): Promise<NotificationStats> => {
    try {
      const { data } = await apiClient.get<NotificationStats>(
        "/notifications/stats/"
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to load notification stats.");
    }
  },

  markNotificationsAsRead: async (
    notificationIds: number[]
  ): Promise<BulkActionResponse> => {
    try {
      const { data } = await apiClient.post<BulkActionResponse>(
        "/notifications/bulk-action/",
        {
          action: "mark_read",
          notification_ids: notificationIds,
        }
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to mark notifications as read.");
    }
  },

  markNotificationsAsUnread: async (
    notificationIds: number[]
  ): Promise<BulkActionResponse> => {
    try {
      const { data } = await apiClient.post<BulkActionResponse>(
        "/notifications/bulk-action/",
        {
          action: "mark_unread",
          notification_ids: notificationIds,
        }
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to mark notifications as unread.");
    }
  },

  markAllAsRead: async (): Promise<BulkActionResponse> => {
    try {
      // D'abord récupérer toutes les notifications non lues
      const stats = await notificationsService.getNotificationStats();
      if (stats.unread_count === 0) {
        return { message: "Aucune notification non lue", affected_count: 0 };
      }

      // Récupérer toutes les notifications pour obtenir leurs IDs
      const notifications = await notificationsService.getNotifications();
      const unreadIds = notifications.results
        .filter((notification) => !notification.is_read)
        .map((notification) => notification.id);

      if (unreadIds.length === 0) {
        return { message: "Aucune notification non lue", affected_count: 0 };
      }

      return await notificationsService.markNotificationsAsRead(unreadIds);
    } catch (error) {
      throw handleApiError(error, "Failed to mark all notifications as read.");
    }
  },
};

export default notificationsService;
