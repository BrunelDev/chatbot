import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import { useFormStore } from "@/context/useFormStore";
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

const goalsData = [
  { title: "Favoriser la pousse", value: "Pousse" },
  { title: "Réduire la casse", value: "Force" },
  { title: "Définir mes boucles", value: "Brillance" },
  { title: "Hydrater mes cheveux", value: "Volume" },
  { title: "Gérer les frisottis", value: "Hydratation" },
  { title: "Stimuler le cuir chevelu", value: "Stimulation" },
];

export default function FormOne() {
  const { goals, setFormData } = useFormStore();

  const handleSelectGoal = (value: string) => {
    const newGoals = goals.includes(value)
      ? goals.filter((item) => item !== value)
      : [...goals, value];
    setFormData({ goals: newGoals });
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
          <Title title="Quels sont vos objectifs capillaires ?" />
          <SubTitle title="Cette question nous permettra de personnaliser les conseils selon vos attentes" />
        </View>
        <View className="flex flex-row flex-wrap gap-y-4 gap-x-2">
          {goalsData.map((goal) => (
            <Objective
              key={goal.value}
              title={goal.title}
              value={goal.value}
              active={goals.includes(goal.value)}
              onPress={handleSelectGoal}
            />
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

const Objective = ({
  title,
  value,
  active,
  onPress,
}: {
  title: string;
  value: string;
  active: boolean;
  onPress: (value: string) => void;
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
