import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import { HAIR_TYPE_CHOICES } from "@/context/useFormStore";
import { useHairProfile } from "@/hooks/useHairProfile";
import profileService from "@/services/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function FormTwo() {
  const { hairProfile, setHairProfile, isLoading } = useHairProfile();
  const [selectedHairType, setSelectedHairType] = useState<string | null>(null);

  // Charger les données du profil existant
  useEffect(() => {
    if (hairProfile?.hair_type) {
      setSelectedHairType(hairProfile.hair_type);
    }
  }, [hairProfile]);

  const isValid = useMemo(() => !!selectedHairType, [selectedHairType]);

  const hairTypes = [
    {
      title: "Cheveux lisses",
      value: HAIR_TYPE_CHOICES.Lisse,
      image: require("../../assets/images/cheveux_lisses.png"),
    },
    {
      title: "Cheveux ondulés",
      value: HAIR_TYPE_CHOICES.Ondule,
      image: require("../../assets/images/cheveux_ondules.png"),
    },
    {
      title: "Cheveux bouclés",
      value: HAIR_TYPE_CHOICES.Boucle,
      image: require("../../assets/images/cheveux_boucles.png"),
    },
    {
      title: "Cheveux frisés",
      value: HAIR_TYPE_CHOICES.Frise,
      image: require("../../assets/images/cheveux_frises.png"),
    },
    {
      title: "Cheveux crépus",
      value: HAIR_TYPE_CHOICES.Crepu,
      image: require("../../assets/images/cheveux_crepus.png"),
    },
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
      <SafeAreaView className="flex-1 bg-candlelight-50 px-4" edges={["top"]}>
        <GoBack />
        <View className="flex flex-col gap-y-4" style={{ marginBottom: 16 }}>
          <Title title="Quel est votre type de cheveux ?" />
          <SubTitle title="Cette question nous permettra d’ identifier la texture principale pour personnaliser les conseils." />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <View className="flex flex-row flex-wrap gap-y-4 gap-x-4">
            {hairTypes.map((hairType) => (
              <HairType
                title={hairType.title}
                value={hairType.value}
                image={hairType.image}
                key={hairType.value}
                selectedHairType={selectedHairType}
                setSelectedHairType={setSelectedHairType}
              />
            ))}
          </View>
        </ScrollView>

        {/* Sticky footer button */}
        <View className="absolute bottom-14 left-4 right-4">
          <PrimaryButton
            title="Enregistrer"
            showLoading={true}
            loadingValue="Enregistrement..."
            handlePress={async () => {
              if (selectedHairType) {
                const newProfile = await profileService.updateHairProfile({
                  hair_type: selectedHairType,
                });
                await AsyncStorage.setItem(
                  "hairProfile",
                  JSON.stringify(newProfile)
                );
                router.back();
              }
            }}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const HairType = ({
  title,
  value,
  image,
  selectedHairType,
  setSelectedHairType,
}: {
  title: string;
  value: string;
  image: string;
  selectedHairType: string | null;
  setSelectedHairType: (value: string) => void;
}) => {
  const { width } = useWindowDimensions();
  const isActive = selectedHairType === value;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        width: width / 2 - 24,
      }}
      onPress={() => setSelectedHairType(value)}
      className={`flex flex-col gap-3 items-center justify-between pt-1 pb-3 px-1 rounded-xl ${
        isActive ? "bg-envy-200" : "bg-envy-100"
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
