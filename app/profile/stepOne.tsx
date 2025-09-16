import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";

import { Image } from "expo-image";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useHairProfile } from "@/hooks/useHairProfile";
import profileService from "@/services/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FormOne() {
  const { hairProfile, setHairProfile, isLoading } = useHairProfile();
  const [hairGoals, setHairGoals] = useState<string[]>([]);

  useEffect(() => {
    if (hairProfile?.goals) {
      console.log(hairProfile);
      setHairGoals(hairProfile.goals);
    }
  }, [hairProfile]);

  const goals = [
    { title: "Favoriser la pousse", value: "Pousse" },
    { title: "Réduire la casse", value: "Force" }, 
    { title: "Définir mes boucles", value: "Brillance" },
    { title: "Hydrater mes cheveux", value: "Volume" },
    { title: "Gérer les frisottis", value: "Hydratation" },
    { title: "Stimuler le cuir chevelu", value: "Stimulation" },
  ];

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color="green" size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-candlelight-50 px-4">
        <SafeAreaView />
        <GoBack />
        <View className="flex flex-col gap-y-4 my-4">
          <Title title="Quels sont vos objectifs capillaires ?" />
          <SubTitle title="Cette question nous permettra de personnaliser les conseils selon vos attentes" />
        </View>
        <View className="flex flex-row flex-wrap gap-y-4 gap-x-2">
          {goals.map((goal) => (
            <Objective
              title={goal.title}
              value={goal.value}
              key={goal.value}
              goals={hairGoals}
              setGoals={setHairGoals}
            />
          ))}
        </View>

        {/* Sticky footer button */}
        <View className="absolute bottom-14 left-4 right-4">
          <PrimaryButton
            title="Enregistrer"
            showLoading={true}
            loadingValue="Enregistrement..."
            handlePress={async() => {
              const newProfile = await profileService.updateHairProfile({ goals: hairGoals });
              await AsyncStorage.setItem('hairProfile', JSON.stringify(newProfile));
              router.back()
            }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const Objective = ({
  title,
  value,
  goals,
  setGoals,
}: {
  title: string;
  value: string;
  goals: string[];
  setGoals: (v: string[]) => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        if (goals.includes(value)) {
          setGoals(goals.filter((g) => g !== value));
        } else {
          setGoals([...goals, value]);
        }
      }}
      className={`px-4 py-2 w-fit h-[44px] flex flex-row items-center gap-3 ${
        goals.includes(value) ? "bg-envy-500" : "border border-envy-300"
      }`}
      style={{ borderRadius: 12 }}
    >
      {goals.includes(value) ? (
        <Image
          source={require("@/assets/icons/yellow-check.svg")}
          style={{ width: 16, height: 16 }}
        />
      ) : (
        <View
          className={`rounded-full border border-envy-300`}
          style={{ width: 16, height: 16 }}
        >
          {goals.includes(value) && <Check size={12} color="#587950" />}
        </View>
      )}

      <Text
        style={{ flexBasis: "auto" }}
        className={`font-medium text-sm ${
          goals.includes(value) ? "text-white" : "text-envy-950"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
