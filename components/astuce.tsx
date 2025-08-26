import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";

export function Tip({
  category,
  title,
  description,
  link,
  id,
}: {
  category: string;
  title: string;
  description: string;
  link: string;
  id: string;
}) {
  return (
    <View className="flex flex-col gap-y-4">
      <View className="px-4 pt-1  border-l-2 border-envy-200 flex flex-col gap-y-2">
        <Text className="text-xs underline text-[#4D5962]">{category}</Text>
        <Text className="text-candlelight-700 font-medium text-sm">{title}</Text>
        <Text className="text-[#4D5962] text-xs">{description}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push(link)}>
      <Text className="text-[10px] text-[#587950] underline">{link}</Text>
      </TouchableOpacity>
    </View>
  );
}
