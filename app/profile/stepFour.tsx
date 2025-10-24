import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import { HAIR_CONCERNS_CHOICES, useFormStore } from "@/context/useFormStore";
import profileService from "@/services/profile";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Option = {
  key: string;
  label: string;
};

const HAIR_TYPES: Option[] = [
  { key: "dry", label: "Sec" },
  { key: "oily", label: "Gras" },
  { key: "normal", label: "Normal" },
  { key: "combination", label: "Mixte" },
];

const SCALP_CONDITIONS: Option[] = [
  { key: "dandruff", label: "Pellicules" },
  { key: "itchy", label: "Démangeaisons" },
  { key: "sensitive", label: "Sensible" },
  { key: "normal", label: "Normal" },
];

const HAIR_GOALS: Option[] = [
  { key: "growth", label: "Pousse" },
  { key: "strength", label: "Force" },
  { key: "shine", label: "Brillance" },
  { key: "volume", label: "Volume" },
  { key: "hydrate", label: "Hydratation" },
];

const ROUTINE_FREQ: Option[] = [
  { key: "daily", label: "Quotidienne" },
  { key: "2-3week", label: "2-3x/sem" },
  { key: "weekly", label: "Hebdo" },
  { key: "biweekly", label: "Bi-hebdo" },
];

export default function FormOne() {
  const [hairType, setHairType] = useState<string | null>(null);
  const [routineFrequency, setRoutineFrequency] = useState<string | null>(null);

  const toggleMulti = (
    list: string[],
    key: string,
    setter: (v: string[]) => void
  ) => {
    if (list.includes(key)) {
      setter(list.filter((k) => k !== key));
    } else {
      setter([...list, key]);
    }
  };

  const isValid = useMemo(
    () => !!hairType && !!routineFrequency,
    [hairType, routineFrequency]
  );

  const Chip = ({
    active,
    children,
  }: {
    active: boolean;
    children: React.ReactNode;
  }) => (
    <View
      className={`px-4 py-2 rounded-full border ${
        active ? "bg-[#5879501A] border-[#587950]" : "border-gray-300"
      }`}
    >
      <Text className={`${active ? "text-[#587950]" : "text-black"}`}>
        {children}
      </Text>
    </View>
  );
  const problemsData: { title: string; value: HAIR_CONCERNS_CHOICES }[] = [
    { title: "Cheveux secs", value: HAIR_CONCERNS_CHOICES.CheveuxSec },
    { title: "Cheveux gras", value: HAIR_CONCERNS_CHOICES.CheveuxGras },
    { title: "Pellicules", value: HAIR_CONCERNS_CHOICES.Pellicules },
    { title: "Démangeaisons", value: HAIR_CONCERNS_CHOICES.Demangeaisons },
    { title: "Chute de cheveux", value: HAIR_CONCERNS_CHOICES.ChuteCheveux },
    { title: "Manque de volume", value: HAIR_CONCERNS_CHOICES.ManqueDeVolume },
  ];
  const handleSelectProblem = (value: HAIR_CONCERNS_CHOICES) => {
    if (!value || !hairProblems) return;
    const newProblems = hairProblems.includes(value)
      ? hairProblems.filter((item) => item !== value)
      : [...hairProblems, value];
    setFormData({ hairProblems: newProblems });
  };
  const { hairProblems, setFormData } = useFormStore();

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
        <View className="absolute bottom-14 left-4 right-4">
          <PrimaryButton
            title="Enregistrer"
            handlePress={async () => {
              if (hairProblems) {
                await profileService.updateHairProfile({
                  concerns: hairProblems,
                });
              }
              router.back();
            }}
            showLoading={true}
            loadingValue="Modification..."
          />
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
