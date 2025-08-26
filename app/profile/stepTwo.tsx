import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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

export default function FormTwo() {
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
  const hairTypes = [
    {
      title: "Cheveux lisses",
      value: "Pousse",
      image: require("../../assets/images/cheveux_lisses.png"),
    },
    {
      title: "Cheveux ondulés",
      value: "Force",
      image: require("../../assets/images/cheveux_ondules.png"),
    },
    {
      title: "Cheveux bouclés",
      value: "Brillance",
      image: require("../../assets/images/cheveux_boucles.png"),
    },
    {
      title: "Cheveux frisés à crépus",
      value: "Volume",
      image: require("../../assets/images/cheveux_crepus.png"),
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
        <View className="flex flex-col gap-y-4" style={{marginBottom: 16}}>
          <Title title="Quel est votre type de cheveux ?" />
          <SubTitle title="Cette question nous permettra d’ identifier la texture principale pour personnaliser les conseils." />
        </View>
        <View className="flex flex-row flex-wrap gap-y-4 gap-x-4">
          {hairTypes.map((hairType) => (
            <HairType
              title={hairType.title}
              value={hairType.value}
              image={hairType.image}
            />
          ))}
        </View>

        {/* Sticky footer button */}
        <View className="absolute w-full bottom-10 left-4 flex flex-row items-center justify-between ">
          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={() => {
              router.push("/profil_capillaire/formThree");
            }}
          >
            <Text className="text-[#4D5962] font-medium">Je ne sais pas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/profil_capillaire/formThree");
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

const HairType = ({
  title,
  value,
  image,
}: {
  title: string;
  value: string;
  image: string;
}) => {
  const [active, setActive] = useState(false);
  const { width, height } = useWindowDimensions();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        width: width/2 -24,
      }}
      onPress={() => setActive(!active)}
      className={`flex flex-col gap-3 items-center justify-between pt-1 pb-3 px-1 rounded-xl ${active ? "bg-envy-200" : "bg-envy-100"}`}
    >
      <Image source={image} style={{ width: "100%", height: 170 }} />
      <Text style={{ flexBasis: "auto" }} className="font-medium text-envy-950 text-sm">
        {title}
      </Text>
    </TouchableOpacity>
  );
};
