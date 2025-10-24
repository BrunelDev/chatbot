import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import { ROUTINE_STATUS_CHOICES, useFormStore } from "@/context/useFormStore";
import profileService from "@/services/profile";
import { pickerStyle } from "@/styles/pickerStyle";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FormThree() {
  const [value, setValue] = useState("");
  const hairHeight = [
    {
      value: ROUTINE_STATUS_CHOICES.Definie,
      label: "Oui, j'ai une routine bien définie",
    },
    {
      value: ROUTINE_STATUS_CHOICES.Irreguliere,
      label: "J’en ai une mais je ne suis pas régulière",
    },
    {
      value: ROUTINE_STATUS_CHOICES.Debutante,
      label: "Non, je débute",
    },
  ];
  const { routineFrequency, setFormData } = useFormStore();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-candlelight-50 px-4">
        <SafeAreaView />
        <GoBack />
        <View className="flex flex-col gap-y-4" style={{ marginBottom: 16 }}>
          <Title title="Avez-vous une routine capillaire actuelle ?" />
          <SubTitle title="Cette question nous permettra d’ adapter les conseils au niveau de maturité de l’utilisateur" />
        </View>
        <Picker
          selectedValue={value}
          onValueChange={(value) => {
            setValue(value);
            console.log("value", value);
            setFormData({
              routineFrequency: hairHeight.find((item) => item.value === value)
                ?.value as ROUTINE_STATUS_CHOICES,
            });
          }}
          itemStyle={pickerStyle.pickerItem}
        >
          {hairHeight.map((item) => (
            <Picker.Item
              label={item.label}
              value={item.value}
              style={{
                color: "#121C12",
                fontSize: 10,
                fontWeight: "400",
                lineHeight: 24,
                paddingVertical: "auto",
              }}
            />
          ))}
        </Picker>

        {/* Sticky footer button */}
        <View className="absolute bottom-14 left-4 right-4">
          <PrimaryButton
            title="Enregistrer"
            handlePress={async () => {
              if (value) {
                console.log("value", value);
                await profileService.updateHairProfile({
                  routine_status: value,
                });
              }
              router.back();
            }}
            showLoading={true}
            loadingValue="Enregistrement..."
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
