import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import { useFormStore } from "@/context/useFormStore";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

const hairTypesData = [
  {
    title: "Cheveux lisses",
    value: "Lisse",
    image: require("../../assets/images/cheveux_lisses.png"),
  },
  {
    title: "Cheveux ondulés",
    value: "Ondulé",
    image: require("../../assets/images/cheveux_ondules.png"),
  },
  {
    title: "Cheveux bouclés",
    value: "Bouclé",
    image: require("../../assets/images/cheveux_boucles.png"),
  },
  {
    title: "Cheveux frisés à crépus",
    value: "Crépu",
    image: require("../../assets/images/cheveux_crepus.png"),
  },
];

export default function FormTwo() {
  const { hairType, setFormData } = useFormStore();

  const handleSelectHairType = (value: string) => {
    setFormData({ hairType: value });
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
          <Title title="Quel est votre type de cheveux ?" />
          <SubTitle title="Cette question nous permettra d’ identifier la texture principale pour personnaliser les conseils." />
        </View>
        <View className="flex flex-row flex-wrap gap-y-4 gap-x-4">
          {hairTypesData.map((type) => (
            <HairType
              key={type.value}
              title={type.title}
              value={type.value}
              image={type.image}
              active={hairType === type.value}
              onPress={handleSelectHairType}
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
  active,
  onPress,
}: {
  title: string;
  value: string;
  image: any;
  active: boolean;
  onPress: (value: string) => void;
}) => {
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        width: width / 2 - 24,
      }}
      onPress={() => onPress(value)}
      className={`flex flex-col gap-3 items-center justify-between pt-1 pb-3 px-1 rounded-xl ${
        active ? "bg-envy-200" : "bg-envy-100"
      }`}
    >
      <Image source={image} style={{ width: "100%", height: 170 }} />
      <Text
        style={{ flexBasis: "auto" }}
        className="font-medium text-envy-950 text-sm"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
