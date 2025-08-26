import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import profileService from "@/services/profile";

export default function FormThree() {
  const [value, setValue] = useState("");
  const hairHeight = [
    {
      value: "Oui j'ai une routine bien définie",
      label: "Oui, j'ai une routine bien définie",
    },
    {
      value: "Non j'ai pas de routine",
      label: "J’en ai une mais je ne suis pas régulière",
    },
    {
      value: "Non, je débute",
      label: "Non, je débute",
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-candlelight-50 px-4">
        <SafeAreaView />
        <GoBack />
        <View className="flex flex-col gap-y-4" style={{ marginBottom: 16 }}>
          <Title title="Quelle est la longueur de vos cheveux ?" />
          <SubTitle title="Cette question nous permettra d’ adapter les conseils à la longueur (routines, produits, etc.)" />
        </View>
        <WheelPicker
          data={hairHeight}
          value={value}
          onValueChanged={({ item: { value } }) => setValue(value)}
          enableScrollByTapOnItem={true}
          itemTextStyle={{
            color: "#121C12",
            fontSize: 16,
            fontWeight: "400",
            lineHeight: 24,
            paddingVertical: "auto",
          }}
        />

        {/* Sticky footer button */}
        <View className="absolute w-full bottom-10 left-4 flex flex-row items-center justify-between ">
          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={() => {
              router.push("/(tabs)/home");
            }}
          >
            <Text className="text-[#4D5962] font-medium">Passer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/(tabs)/home");
            }}
            className="flex flex-row  justify-center items-center bg-candlelight-500 rounded-full"
            style={{ width: 44, height: 44 }}
          >
            <Image
              source={require("../../assets/icons/arrow-left.svg")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}


