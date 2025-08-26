import { GoBack } from "@/components/headers/goBack";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function Profile() {
  const { height } = useWindowDimensions();
  const options: {
    title: string;
    href: "/(auth)/forgetPassword";
    icon: string;
  }[] = [
    {
      title: "Mot de passe",
      href: "/(auth)/forgetPassword",
      icon: require("../../assets/icons/lock.svg"),
    },
    {
      title: "Assistance client",
      href: "/(auth)/forgetPassword",
      icon: require("../../assets/icons/message-question.svg"),
    },
    {
      title: "Sécurité et confidentialité",
      href: "/(auth)/forgetPassword",
      icon: require("../../assets/icons/shield.svg"),
    },
  ];
  return (
    <View className="bg-candlelight-50 h-full w-full">
      <View
        className="px-4 bg-envy-200"
        style={{
          height: height * 0.45,
        }}
      >
        <SafeAreaView />

        <GoBack title="Profil"/>

        <View className="flex flex-1 flex-col items-center justify-center">
          <View>
            <View className="w-[140px] h-[140px] rounded-full overflow-hidden border-2 border-envy-400 mb-2">
              <Image
                source={require("../../assets/images/profile-img.png")}
                style={{ width: 140, height: 140 }}
              />
            </View>
            <TouchableOpacity className="flex items-center justify-center w-[36px] h-[36px] bg-candlelight-100 rounded-full border border-envy-400 absolute bottom-0 right-0">
              <Image
                source={require("../../assets/icons/image.svg")}
                style={{ width: 16, height: 16 }}
              />
            </TouchableOpacity>
          </View>

          <Text className="text-envy-700 text-xl font-medium">
            Emilie AMIRI
          </Text>

          <Text className="text-[#4D5962] text-sm ">emilieamiri@gmail.com</Text>
        </View>
      </View>

      <View className="px-4 mt-6 flex flex-col gap-10">
        <TouchableOpacity className="bg-candlelight-100 h-[60px] flex flex-row items-center justify-between px-4 rounded-xl"
        onPress={() => router.push("/profile/resumeCapillaire")}
        activeOpacity={0.7}
        >
          <View className="flex flex-row items-center gap-x-3">
            <Image
              source={require("../../assets/icons/clipboard.svg")}
              style={{ width: 16, height: 16 }}
            />
            <Text className="text-envy-800 text-sm">Résumé capillaire</Text>
          </View>
          <Image
            source={require("../../assets/icons/chevronRight.svg")}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
        <View className="flex flex-col gap-y-6">
          {options.map((option, index) => (
            <Option
              key={index}
              title={option.title}
              href={option.href}
              icon={option.icon}
            />
          ))}
        </View>
      </View>
      <TouchableOpacity className="absolute bottom-14 left-4 right-4 px-4">
          <View className="flex flex-row items-center gap-x-3">
            <Image
              source={require("../../assets/icons/logout.svg")}
              style={{ width: 16, height: 16 }}
            />
            <Text className="text-candlelight-700 text-sm font-medium">Se deconnecter</Text>
          </View>
         
        </TouchableOpacity>
    </View>
  );
}

const Option = ({
  title,
  href,
  icon,
}: {
  title: string;
  href: "/(auth)/forgetPassword";
  icon: string;
}) => {
  return (
    <TouchableOpacity
      onPress={() => router.push(href)}
      className="flex flex-row items-center justify-between pb-4 border-b border-envy-200 px-2"
    >
      <View className="flex flex-row items-center gap-x-3">
        <Image source={icon} style={{ width: 16, height: 16 }} />
        <Text className="text-envy-800 text-sm">{title}</Text>
      </View>
      <Image
        source={require("../../assets/icons/chevronRight.svg")}
        style={{ width: 20, height: 20 }}
      />
    </TouchableOpacity>
  );
};
