import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { Resume } from "@/components/resumeCapillaire";
import { ResumeItem } from "@/components/resumeItem";
import { useUser } from "@/hooks/useUser";
import profileService, { BioProfileResponse } from "@/services/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import { ActivityIndicator, SafeAreaView, View } from "react-native";

export default function ResumeCapillaire() {
  const { user } = useUser();
  const [hairProfile, setHairProfile] =
    React.useState<BioProfileResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  useFocusEffect(
    useCallback(() => {
      const getHairProfile = async () => {
        try {
          const response = await profileService.getBioProfile();
          console.log("Bio profile response", response);
          await AsyncStorage.setItem(
            "hairProfile",
            JSON.stringify(response.hair_profile)
          );
          console.log(response);
          setHairProfile(response);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      getHairProfile();
    }, [])
  );
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
      href: "/profile/stepTwo",
    },
    {
      title: "Longueur des cheveux",
      value: hairProfile?.hair_profile.hair_length || "Inconnu",
      href: "/profile/stepThree",
    },
    {
      title: "Objectifs",
      value: hairProfile?.hair_profile.goals.join(", ") || "Inconnu",
      href: "/profile/stepOne",
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-candlelight-50">
        <ActivityIndicator size="large" color="#C5A26F" />
      </View>
    );
  }

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
            value={item?.value?.split(", ")}
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
