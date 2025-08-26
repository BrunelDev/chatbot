import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ChatHeadBarProps {
  onMenuPress: () => void;
}

export function ChatHeadBar({ onMenuPress }: ChatHeadBarProps) {
  return (
    <View className="w-full h-16 flex flex-row justify-between items-center bg-candlelight-50 border-b border-[#DCE6E9]">
      <TouchableOpacity
        className=" p-2"
        onPress={() => {
          router.back();
        }}
      >
        <Image
          source={require("../../assets/icons/arrow-left.svg")}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
      <View className="flex-row items-center gap-x-2">
      <Image
          source={require("../../assets/images/chatbot.png")}
          style={{ width: 40, height: 40 }}
        />
      <Text className="text-[#4D5962] text-[16px]  font-medium">
        Cheveux texturé AI
      </Text>
      </View>
      <TouchableOpacity onPress={onMenuPress}>
        <Image
          source={require("../../assets/icons/ellipsis.svg")}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
    </View>
  );
}
