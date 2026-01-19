import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import {
  HAIR_LENGTH_CHOICES,
  HAIR_TYPE_CHOICES,
  ROUTINE_STATUS_CHOICES,
  useFormStore,
} from "@/context/useFormStore";
import profileService from "@/services/profile";
import { pickerStyle } from "@/styles/pickerStyle";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const routineFrequencyData = [
  {
    value: ROUTINE_STATUS_CHOICES.Definie,
    label: "Oui, j'ai une routine bien définie",
  },
  {
    value: ROUTINE_STATUS_CHOICES.Irreguliere,
    label: "J’en ai une mais je ne suis pas régulière",
  },
  { value: ROUTINE_STATUS_CHOICES.Debutante, label: "Non, je débute" },
];
const data = [...Array(100).keys()].map((index) => ({
  value: index,
  label: index.toString(),
}));
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

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return; // Empêcher les soumissions multiples

    /**
     *   goals?: string[];
  hair_type?: string;
  hair_height?: string;
  concerns?: string[];
  routine_status?: string;
     */
    if (
      !hairType ||
      !hairHeight ||
      !goals ||
      !hairProblems ||
      !routineFrequency
    ) {
      //Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      console.log("Champs requis manquants", {
        routineFrequency,
        hairType,
        hairHeight,
        goals,
        hairProblems,
      });
      setFormData({
        hairHeight: HAIR_LENGTH_CHOICES.TresCourts,
        routineFrequency: ROUTINE_STATUS_CHOICES.Debutante,
      });
      //return;
    }

    try {
      setIsLoading(true);
      console.log("hairType", hairType);
      console.log("hairHeight", hairHeight);
      console.log("goals", goals);
      console.log("hairProblems", hairProblems);
      console.log("routineFrequency", routineFrequency);
      const payload: {
        hair_type?: HAIR_TYPE_CHOICES;
        hair_height?: HAIR_LENGTH_CHOICES;
        goals?: string[];
        concerns?: string[];
        routine_status?: string;
      } = {};
      if (hairType) {
        payload["hair_type"] = hairType;
      }
      await profileService.updateHairProfile({
        hair_type: hairType,
        hair_height: hairHeight,
        goals: goals || [],
        concerns: hairProblems || [],
        routine_status: routineFrequency,
      });
      Alert.alert("Succès", "Votre profil capillaire a été créé avec succès.");
      resetForm();
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création de votre profil."
      );
    } finally {
      setIsLoading(false);
    }
  };
  //const [value, setValue] = useState(0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-candlelight-50 px-4" edges={["top"]}>
        <GoBack />
        <View className="flex flex-col gap-y-4" style={{ marginBottom: 16 }}>
          <Title title="Avez-vous une routine capillaire ?" />
          <SubTitle title="Cette information nous aide à comprendre votre niveau d’expérience et vos habitudes." />
        </View>
        <Picker
          selectedValue={
            routineFrequency == ""
              ? ROUTINE_STATUS_CHOICES.Debutante
              : routineFrequency
          }
          onValueChange={(value) => {
            console.log("value", value);
            setFormData({ routineFrequency: value });
          }}
          itemStyle={pickerStyle.pickerItem}
        >
          {routineFrequencyData.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>

        {/* Sticky footer button */}
        <View className="absolute w-full bottom-10 left-4 flex flex-row items-center justify-between ">
          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={async () => {
              await handleSubmit();
            }}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.5 : 1 }}
          >
            <Text className="text-[#4D5962] font-medium">Passer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await handleSubmit();
            }}
            disabled={isLoading}
            className="flex flex-row  justify-center items-center bg-candlelight-500 rounded-full"
            style={{
              width: 44,
              height: 44,
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Image
                source={require("../../assets/icons/arrow-right.svg")}
                style={{ width: 20, height: 20 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
