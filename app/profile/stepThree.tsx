import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

export default function FormThree() {
  const [value, setValue] = useState('');
  const hairHeight = [
    {
      value: "Très courts",
      label: "Très courts",
    },
    {
      value: "Courts",
      label: "Courts",
    },
    {
      value: "Mi-longs",
      label: "Mi-longs",
    },
    {
      value: "Longs",
      label: "Longs",
    },
    {
      value: "Très longs",
      label: "Très longs",
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
        <View className="flex flex-col gap-y-4" style={{ marginBottom: 16 }}>
          <Title title="Quelle est la longueur de vos cheveux ?" />
          <SubTitle title="Cette question nous permettra d’ adapter les conseils à la longueur (routines, produits, etc.)" />
        </View>
        <WheelPicker
          data={hairHeight}
          value={value}
          onValueChanged={({ item: { value } }) => setValue(value)}
          enableScrollByTapOnItem={true}
        
          itemTextStyle={{
            color: "#121C12",
            fontSize: 16,
            fontWeight: "400",
            lineHeight: 24,
            paddingVertical: "auto"
          }}
          
        />

        {/* Sticky footer button */}
        <View className="absolute w-full bottom-10 left-4 flex flex-row items-center justify-between ">
          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={() => {
              router.push("/profil_capillaire/formFour");
            }}
          >
            <Text className="text-[#4D5962] font-medium">Je ne sais pas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push("/profil_capillaire/formFour");
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
        width: width / 2 - 24,
      }}
      onPress={() => setActive(!active)}
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
