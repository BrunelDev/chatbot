import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";

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
        <View className="absolute bottom-14 left-4 right-4">
          <PrimaryButton
            title="Enregistrer"
            handlePress={() => router.back()}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
