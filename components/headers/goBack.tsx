import { RelativePathString, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

export function GoBack({
  title,
  path,
  replace,
}: {
  title?: string;
  path?: RelativePathString;
  replace?: boolean;
}) {
  return (
    <View
      className="relative flex flex-row items-center my-5"
      style={{
        paddingTop: Platform.OS === "android" ? 32 : 0,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (path) {
            if (replace) {
              router.replace(path);
            } else {
              router.push(path);
            }
          } else {
            router.back();
          }
        }}
        className="p-2"
      >
        <ArrowLeft size={25} color="#022440" />
      </TouchableOpacity>

      {title && (
        <View className="absolute left-0 right-0 items-center">
          <Text
            className="text-[#4D5962] text-base font-medium"
            style={{ fontFamily: "Gt_Super" }}
          >
            {title}
          </Text>
        </View>
      )}
    </View>
  );
}
