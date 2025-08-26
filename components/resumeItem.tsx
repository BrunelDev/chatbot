import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export function ResumeItem({
  title,
  value,
  href,
}: {
  title: string;
  value: string;
  href:
    | "/profile/stepOne"
    | "/profile/stepTwo"
    | "/profile/stepThree"
    | "/profile/stepFour"
    | "/profile/stepFive";
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(href)}
      className="flex flex-row justify-between items-center pb-2 border-b border-envy-200"
    >
      <View className="flex flex-col gap-y-3">
        <View className="flex flex-row items-center gap-x-2">
          <View
            style={{
              width: 8,
              height: 8,
              backgroundColor: "#EFC403",
              borderRadius: 99999,
            }}
          ></View>
          <Text className="text-envy-800 text-sm font-medium">{title}</Text>
        </View>
        <Text className="text-[#4D5962] text-xs">{value}</Text>
      </View>

      <Image
        source={require("@/assets/icons/chevronRight.svg")}
        style={{ width: 20, height: 20 }}
      />
    </TouchableOpacity>
  );
}
