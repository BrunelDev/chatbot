import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { Resume } from "@/components/resumeCapillaire";
import { ResumeItem } from "@/components/resumeItem";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, View } from "react-native";

export default function ResumeCapillaire() {
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
      value: "cheveux crépus",
      href: "/profile/stepOne",
    },
    {
      title: "Longueur des cheveux",
      value: "Cheveux courts",
      href: "/profile/stepTwo",
    },
    {
      title: "Objectifs",
      value: "Pousse, réduction de la casse",
      href: "/profile/stepThree",
    },
    {
      title: "Problèmes",
      value: "Cuir chevelu sec, casse excessive",
      href: "/profile/stepFour",
    },
    {
      title: "Routines",
      value: "Aucune pour le moment",
      href: "/profile/stepFive",
    },
  ];
  return (
    <View className="bg-candlelight-50 flex-1 w-full px-4">
      <SafeAreaView />
      <GoBack title="Résumé capillaire" />
      <Resume />
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
