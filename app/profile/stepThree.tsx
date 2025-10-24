import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import { HAIR_LENGTH_CHOICES, useFormStore } from "@/context/useFormStore";
import profileService from "@/services/profile";
import { pickerStyle } from "@/styles/pickerStyle";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FormThree() {
  const [value, setValue] = useState("");

  const hairHeightData = [
    { value: HAIR_LENGTH_CHOICES.TresCourts, label: "Très courts" },
    { value: HAIR_LENGTH_CHOICES.Courts, label: "Courts" },
    { value: HAIR_LENGTH_CHOICES.MiLongs, label: "Mi-longs" },
    { value: HAIR_LENGTH_CHOICES.Longs, label: "Longs" },
    { value: HAIR_LENGTH_CHOICES.TresLongs, label: "Très longs" },
  ];
  const { hairHeight, setFormData } = useFormStore();

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
        <Picker
          itemStyle={pickerStyle.pickerItem}
          selectedValue={hairHeight}
          onValueChange={  (value)  => {
            switch (value) {
              case HAIR_LENGTH_CHOICES.TresCourts:
                setFormData({ hairHeight: HAIR_LENGTH_CHOICES.TresCourts });
                break;
              case HAIR_LENGTH_CHOICES.Courts:
                setFormData({ hairHeight: HAIR_LENGTH_CHOICES.Courts });
                break;
              case HAIR_LENGTH_CHOICES.MiLongs:
                setFormData({ hairHeight: HAIR_LENGTH_CHOICES.MiLongs });
                break;
              case HAIR_LENGTH_CHOICES.Longs:
                setFormData({ hairHeight: HAIR_LENGTH_CHOICES.Longs });
                break;
              case HAIR_LENGTH_CHOICES.TresLongs:
                setFormData({ hairHeight: HAIR_LENGTH_CHOICES.TresLongs });
                break;
              default:
                setFormData({ hairHeight: "" });
            }
          }}
        >
          {hairHeightData.map((item) => (
            <Picker.Item label={item.label} value={item.value} />
          ))}
        
        </Picker>
     

        {/* Sticky footer button */}
        <View className="absolute bottom-14 left-4 right-4">
          <PrimaryButton title="Enregister" loadingValue="Enregistrement..." showLoading={true} handlePress={async () => {
            if (hairHeight) {
              console.log("hairHeight", hairHeight)
              await profileService.updateHairProfile({ hair_length: hairHeight })
            }
            router.back()
          }} />
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
