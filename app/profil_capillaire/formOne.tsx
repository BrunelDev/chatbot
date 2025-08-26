import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
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
  const [scalpConditions, setScalpConditions] = useState<string[]>([]);
  const [hairGoals, setHairGoals] = useState<string[]>([]);
  const [routineFrequency, setRoutineFrequency] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

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
  const goals = [
    { title: "Favoriser la pousse", value: "Pousse" },
    { title: "Réduire la classe", value: "Force" },
    { title: "Définir mes boucles", value: "Brillance" },
    { title: "Hydrater mes cheveux", value: "Volume" },
    { title: "Gérer les frisottis", value: "Hydratation" },
    { title: "Stimuler le cuir chevelu", value: "Hydratation" },
  ];

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
            <Objective title={goal.title} value={goal.value} key={goal.value} />
          ))}
        </View>

        {/* Sticky footer button */}
        <View className="absolute w-full bottom-10 left-4 flex flex-row items-center justify-between ">
          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={() => {
              router.push("/profil_capillaire/formTwo");
            }}
          >
            <Text className="text-[#4D5962] font-medium">Passer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/profil_capillaire/formTwo");
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

const Objective = ({ title, value }: { title: string; value: string }) => {
  const [active, setActive] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setActive(!active)}
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

      <Text style={{ flexBasis: "auto" }} className={`font-medium text-sm ${active ? "text-white" : "text-envy-950"}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
