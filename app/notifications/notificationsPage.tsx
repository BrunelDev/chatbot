import { GoBack } from "@/components/headers/goBack";
import notificationsService, {
  Notification,
} from "@/services/notificationsService";
import { Image } from "expo-image";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await notificationsService.getNotifications(1, 20);
        setNotifications(response.results);
        setCurrentPage(1);
        setHasNextPage(!!response.next);
        setTotalCount(response.count);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const onRefresh = async () => {
    try {
      setIsRefreshing(true);
      const response = await notificationsService.getNotifications(1, 20);
      setNotifications(response.results);
      setCurrentPage(1);
      setHasNextPage(!!response.next);
      setTotalCount(response.count);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fonction pour charger plus de notifications
  const loadMoreNotifications = useCallback(async () => {
    if (!hasNextPage || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await notificationsService.getNotifications(
        nextPage,
        20
      );

      setNotifications((prev) => [...prev, ...response.results]);
      setCurrentPage(nextPage);
      setHasNextPage(!!response.next);
    } catch (error) {
      console.error(
        "Erreur lors du chargement de plus de notifications:",
        error
      );
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasNextPage, isLoadingMore]);

  // Fonction pour marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationsService.markNotificationsAsRead([notificationId]);
      // Mettre à jour l'état local
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  }, []);
  return (
    <View className="bg-candlelight-50 h-full w-full px-4">
      <SafeAreaView />
      <GoBack
        title={`Notifications${totalCount > 0 ? ` (${totalCount})` : ""}`}
      />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#587950" />
          <Text className="text-[#4D5962] mt-4 font-worksans">
            Chargement des notifications...
          </Text>
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <NotificationItem notification={item} onMarkAsRead={markAsRead} />
          )}
          ItemSeparatorComponent={() => <View className="h-6" />}
          ListEmptyComponent={() => <EmptyState />}
          ListFooterComponent={() =>
            isLoadingMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#587950" />
                <Text className="text-[#4D5962] mt-2 text-sm font-worksans">
                  Chargement...
                </Text>
              </View>
            ) : null
          }
          onEndReached={loadMoreNotifications}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#587950"]}
              tintColor="#587950"
            />
          }
        />
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

const EmptyState = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="bg-envy-200 p-10 rounded-full mb-4">
        <Image
          source={require("../../assets/icons/sheet.svg")}
          style={{ width: 67, height: 67 }}
        />
      </View>
      <Text className="text-envy-500 mb-2 font-borna">Aucune notification</Text>
      <Text className="text-[#4D5962]">
        Toutes vos notifications apparaîtront ici
      </Text>
    </View>
  );
};

const getTimeline = (date: string) => {
  const today = new Date();
  const notificationDate = new Date(date);
  const diffTime = Math.abs(notificationDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return "Aujourd'hui";
  } else if (diffDays === 1) {
    return "Hier";
  } else {
    return `${diffDays}j`;
  }
};

const NotificationItem = ({
  notification,
  onMarkAsRead,
}: {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}) => {
  const handlePress = useCallback(() => {
    // Marquer comme lue quand l'utilisateur appuie sur la notification
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  }, [notification.id, notification.is_read, onMarkAsRead]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`${
        notification.is_read
          ? "bg-candlelight-100 p-3 rounded-xl"
          : "bg-candlelight-200 p-3 rounded-xl"
      } flex flex-col gap-3`}
    >
      <View className="flex flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-envy-800 font-medium text-sm flex-1">
            {notification.title}
          </Text>
          {/* Point pour les notifications non lues */}
          {!notification.is_read && (
            <View className="w-2 h-2 bg-envy-500 rounded-full" />
          )}
        </View>
        <Text className="text-envy-800 text-[10px]">
          {notification.time_ago}
        </Text>
      </View>
      <Text className="text-[#4D5962] text-xs">
        {notification.display_message}
      </Text>
    </TouchableOpacity>
  );
};
