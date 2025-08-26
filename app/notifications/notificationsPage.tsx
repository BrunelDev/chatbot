import { GoBack } from "@/components/headers/goBack";
import { Image } from "expo-image";
import React from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Besoin d’un boost hydratation ? ",
      description: "Testez une méthode LOC adaptée à vos cheveux",
      //date is iso

      date: new Date("2025-08-16").toISOString(),
      read: false,
    },
    {
      id: 2,
      title: "Recommandations de produits",
      description:
        "La gamme ‘Cocoon Hair’ que vous aviez consultée est actuellement en promotion.",
      date: new Date("2025-08-15").toISOString(),
      read: false,
    },
    {
      id: 3,
      title: "Besoin d’un boost hydratation ?",
      description: "Testez une méthode LOC adaptée à vos cheveux",
      date: new Date("2025-08-14").toISOString(),
      read: false,
    },
  ];
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

interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

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
        notification.read ? "" : "bg-candlelight-100 p-3 rounded-xl"
      } flex flex-col gap-3`}
    >
      <View className="flex flex-row items-center justify-between">
        <Text className="text-envy-800 font-medium text-sm">
          {notification.title}
        </Text>
        <Text className="text-envy-800 text-[10px]">
          {getTimeline(notification.date)}
        </Text>
      </View>
      <Text className="text-[#4D5962] text-xs">{notification.description}</Text>
    </View>
  );
};
