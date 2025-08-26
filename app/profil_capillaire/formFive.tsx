import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import { useFormStore } from "@/context/useFormStore";
import profileService from "@/services/profile";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const routineFrequencyData = [
  {
    value: "Oui, j'ai une routine bien définie",
    label: "Oui, j'ai une routine bien définie",
  },
  {
    value: "J’en ai une mais je ne suis pas régulière",
    label: "J’en ai une mais je ne suis pas régulière",
  },
  { value: "Non, je débute", label: "Non, je débute" },
];

export default function FormFive() {
  const {
    goals,
    hairType,
    hairHeight,
    hairProblems,
    routineFrequency,
    scalpConditions,
    notes,
    setFormData,
    resetForm,
  } = useFormStore();

  const handleSubmit = async () => {
    try {
      await profileService.createHairProfile({
        hair_type: hairType,
        hair_height: hairHeight,
        objectives: goals,
        specific_problems: hairProblems,
        routine_frequency: routineFrequency,
      });
      Alert.alert("Succès", "Votre profil capillaire a été créé avec succès.");
      resetForm();
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la création de votre profil.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-candlelight-50 px-4">
        <SafeAreaView />
        <GoBack />
        <View className="flex flex-col gap-y-4" style={{ marginBottom: 16 }}>
          <Title title="Avez-vous une routine capillaire ?" />
          <SubTitle title="Cette information nous aide à comprendre votre niveau d’expérience et vos habitudes." />
        </View>
        <WheelPicker
          data={routineFrequencyData}
          value={routineFrequency}
          onValueChanged={({ item: { value } }) =>
            setFormData({ routineFrequency: value })
          }
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
            onPress={handleSubmit}
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


