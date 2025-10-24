import React from "react";
import { Text, View } from "react-native";

export function Title({ title }: { title: string }) {
  return (
    <View>
      <Text className="text-3xl font-medium text-candlelight-800 font-borna">
        {title}
      </Text>
    </View>
  );
}

export function SubTitle({ title }: { title: string }) {
  return (
    <View>
      <Text className="text-[#4D5962] text-sm">{title}</Text>
    </View>
  );
}
