import { useCallback, useEffect, useState } from "react";
import notificationsService from "../services/notificationsService";

export interface UseNotificationCountReturn {
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  refreshCount: () => Promise<void>;
}

export const useNotificationCount = (): UseNotificationCountReturn => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await notificationsService.getNotificationStats();
      setUnreadCount(stats.unread_count);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des notifications"
      );
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return {
    unreadCount,
    isLoading,
    error,
    refreshCount,
  };
};
