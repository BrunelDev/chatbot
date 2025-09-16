import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import { useFormStore, HAIR_CONCERNS_CHOICES } from "@/context/useFormStore";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const problemsData : { title: string; value: HAIR_CONCERNS_CHOICES }[] = [
  { title: "Cheveux secs", value: HAIR_CONCERNS_CHOICES.CheveuxSec },
  { title: "Cheveux gras", value: HAIR_CONCERNS_CHOICES.CheveuxGras },
  { title: "Pellicules", value: HAIR_CONCERNS_CHOICES.Pellicules },
  { title: "Démangeaisons", value: HAIR_CONCERNS_CHOICES.Demangeaisons },
  { title: "Chute de cheveux", value: HAIR_CONCERNS_CHOICES.ChuteCheveux },
  { title: "Manque de volume", value: HAIR_CONCERNS_CHOICES.ManqueDeVolume },
];

export default function FormFour() {
  const { hairProblems, setFormData } = useFormStore();

  const handleSelectProblem = (value: HAIR_CONCERNS_CHOICES) => {
    if (!value || !hairProblems) return;
    const newProblems = hairProblems.includes(value)
      ? hairProblems.filter((item) => item !== value)
      : [...hairProblems, value];
    setFormData({ hairProblems: newProblems });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-candlelight-50 px-4">
        <SafeAreaView />
        <GoBack />
        <View className="flex flex-col gap-y-4 my-4">
          <Title title="Rencontrez-vous des problèmes spécifiques ?" />
          <SubTitle title="Cette question nous permettra d’ identifier les défis capillaires pour ajuster les recommandations" />
        </View>
        <View className="flex flex-row flex-wrap gap-y-4 gap-x-2">
          {problemsData.map((problem) => (
            <Objective
              key={problem.value}
              title={problem.title}
              value={problem.value}
              active={hairProblems?.includes(problem.value) || false}
              onPress={handleSelectProblem}
            />
          ))}
        </View>

        {/* Sticky footer button */}
        <View className="absolute w-full bottom-10 left-4 flex flex-row items-center justify-between ">
          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={() => {
              router.push("/profil_capillaire/formFive");
            }}
          >
            <Text className="text-[#4D5962] font-medium">Passer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/profil_capillaire/formFive");
            }}
            className="flex flex-row  justify-center items-center bg-candlelight-500 rounded-full"
            style={{ width: 44, height: 44 }}
          >
            <Image
              source={require("../../assets/icons/arrow-right.svg")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const Objective = ({
  title,
  value,
  active,
  onPress,
}: {
  title: string;
  value: HAIR_CONCERNS_CHOICES;
  active: boolean | undefined;
  onPress: (value: HAIR_CONCERNS_CHOICES) => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(value)}
      className={`px-4 py-2 w-fit h-[44px] flex flex-row items-center gap-3 ${
        active ? "bg-envy-500" : "border border-envy-300"
      }`}
      style={{ borderRadius: 12 }}
    >
      {active ? (
        <Image
          source={require("@/assets/icons/yellow-check.svg")}
          style={{ width: 16, height: 16 }}
        />
      ) : (
        <View
          className={`rounded-full border border-envy-300`}
          style={{ width: 16, height: 16 }}
        >
          {active && <Check size={12} color="#587950" />}
        </View>
      )}

      <Text
        style={{ flexBasis: "auto" }}
        className={`font-medium text-sm ${
          active ? "text-white" : "text-envy-950"
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
