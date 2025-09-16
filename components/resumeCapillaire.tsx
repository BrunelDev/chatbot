import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import { useUser } from "@/hooks/useUser";

export function Resume({ bio }: { bio?: string }) {
  const { user } = useUser();

  return (
    <View className="p-3 bg-candlelight-100 rounded-xl flex flex-col gap-3">
      <View className="flex flex-row items-center gap-x-2">
        <Image
          source={require("@/assets/icons/info.svg")}
          style={{ width: 16, height: 16 }}
        />
        <Text className="text-envy-700 font-medium text-sm">
          À propos de {user?.user.username}
        </Text>
      </View>
      <Text className="text-[#4D5962] text-xs">{bio || "Aucune information"}</Text>
    </View>
  );
}
