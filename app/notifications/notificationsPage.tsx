import { GoBack } from "@/components/headers/goBack";
import notificationsService, {
  Notification,
} from "@/services/notificationsService";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationsService.getNotifications();
        setNotifications(response.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotifications();
  }, []);
  return (
    <View className="bg-candlelight-50 h-full w-full px-4">
      <SafeAreaView />
      <GoBack title="Notifications" />
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={({ item }) => <NotificationItem notification={item} />}
          ItemSeparatorComponent={() => <View className="h-4" />}
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
      <Text className="text-envy-500 mb-2">Aucune notification</Text>
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

const NotificationItem = ({ notification }: { notification: Notification }) => {
  return (
    <View
      className={`${
        notification.is_read ? "" : "bg-candlelight-100 p-3 rounded-xl"
      } flex flex-col gap-3`}
    >
      <View className="flex flex-row items-center justify-between">
        <Text className="text-envy-800 font-medium text-sm">
          {notification.title}
        </Text>
        <Text className="text-envy-800 text-[10px]">
          {notification.time_ago}
        </Text>
      </View>
      <Text className="text-[#4D5962] text-xs">
        {notification.display_message}
      </Text>
    </View>
  );
};
