import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { Resume } from "@/components/resumeCapillaire";
import { ResumeItem } from "@/components/resumeItem";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import { useUser } from "@/hooks/useUser";
import profileService, { BioProfileResponse } from "@/services/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ResumeCapillaire() {
  const { user } = useUser();
  const [hairProfile, setHairProfile] =
    React.useState<BioProfileResponse | null>(null);
  useEffect(() => {
    const getHairProfile = async () => {
      try {
        const response = await profileService.getBioProfile();
        console.log("Bio profile response", response);
        await AsyncStorage.setItem("hairProfile", JSON.stringify(response.hair_profile));
        console.log(response);
        setHairProfile(response);
      } catch (error) {
        console.error(error);
      }
    };
    getHairProfile();
  }, []);
  const items: {
    title: string;
    value: string;
    href:
      | "/profile/stepOne"
      | "/profile/stepTwo"
      | "/profile/stepThree"
      | "/profile/stepFour"
      | "/profile/stepFive";
  }[] = [
    {
      title: "Type de cheveux",
      value: hairProfile?.hair_profile.hair_type || "Inconnu",
      href: "/profile/stepOne",
    },
    {
      title: "Longueur des cheveux",
      value: hairProfile?.hair_profile.hair_length || "Inconnu",
      href: "/profile/stepTwo",
    },
    {
      title: "Objectifs",
      value: hairProfile?.hair_profile.goals.join(", ") || "Inconnu",
      href: "/profile/stepThree",
    },
    {
      title: "Problèmes",
      value: hairProfile?.hair_profile.concerns.join(", ") || "Inconnu",
      href: "/profile/stepFour",
    },
    {
      title: "Routines",
      value: hairProfile?.hair_profile.routine_status || "Inconnu",
      href: "/profile/stepFive",
    },
  ];

  return (
    <View className="bg-candlelight-50 flex-1 w-full px-4">
      <SafeAreaView />
      <GoBack title="Résumé capillaire" />
      <Resume bio={hairProfile?.bio} />
      <View className="flex flex-col gap-y-4 mt-6">
        {items.map((item) => (
          <ResumeItem
            key={item.title}
            title={item.title}
            value={item.value}
            href={item.href}
          />
        ))}
      </View>
      <View className="absolute bottom-14 left-4 right-4">
        <PrimaryButton
          title="Modifier"
          handlePress={() => router.push("/profile/stepOne")}
        />
      </View>
    </View>
  );
}
