import {
  HAIR_CONCERNS_CHOICES,
  HAIR_LENGTH_CHOICES,
  HAIR_TYPE_CHOICES,
  ROUTINE_STATUS_CHOICES,
} from "@/context/useFormStore";
import {
  goalsLabels,
  hairConcernsLabels,
  hairLengthLabels,
  hairTypeLabels,
  routineStatusLabels,
} from "@/utils/enumMappings";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";

export function ResumeItem({
  title,
  value,
  href,
}: {
  title: string;
  value:
    | HAIR_CONCERNS_CHOICES[]
    | HAIR_LENGTH_CHOICES[]
    | HAIR_TYPE_CHOICES[]
    | ROUTINE_STATUS_CHOICES[];
  href:
    | "/profile/stepOne"
    | "/profile/stepTwo"
    | "/profile/stepThree"
    | "/profile/stepFour"
    | "/profile/stepFive";
}) {
  const designations = {
    ...hairTypeLabels,
    ...hairLengthLabels,
    ...hairConcernsLabels,
    ...routineStatusLabels,
    ...goalsLabels,
  };
  const {width} = useWindowDimensions()
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(href)}
      className="flex flex-row justify-between items-center pb-2 border-b border-envy-200"
    >
      <View className="flex flex-col gap-y-3" style={{width : width - 60}}>
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
        <Text className="text-[#4D5962] text-xs">
          {Array.isArray(value)
            ? value
                .map(
                  (v) =>
                    designations[v.toLowerCase() as keyof typeof designations]
                )
                .join(", ")
            : designations[value as keyof typeof designations]}
        </Text>
      </View>

      <Image
        source={require("@/assets/icons/chevronRight.svg")}
        style={{ width: 20, height: 20 }}
      />
    </TouchableOpacity>
  );
}
