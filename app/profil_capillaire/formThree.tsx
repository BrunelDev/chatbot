import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import { HAIR_LENGTH_CHOICES, useFormStore } from "@/context/useFormStore";
import { pickerStyle } from "@/styles/pickerStyle";
import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const hairHeightData = [
  { value: HAIR_LENGTH_CHOICES.TresCourts, label: "Très courts" },
  { value: HAIR_LENGTH_CHOICES.Courts, label: "Courts" },
  { value: HAIR_LENGTH_CHOICES.MiLongs, label: "Mi-longs" },
  { value: HAIR_LENGTH_CHOICES.Longs, label: "Longs" },
  { value: HAIR_LENGTH_CHOICES.TresLongs, label: "Très longs" },
];

export default function FormThree() {
  const { hairHeight, setFormData } = useFormStore();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-candlelight-50 px-4" edges={["top"]}>
        <GoBack />
        <View className="flex flex-col gap-y-4" style={{ marginBottom: 16 }}>
          <Title title="Quelle est la longueur de vos cheveux ?" />
          <SubTitle title="Cette question nous permettra d’ adapter les conseils à la longueur (routines, produits, etc.)" />
        </View>
        <Picker
          selectedValue={hairHeight || HAIR_LENGTH_CHOICES.TresCourts}
          onValueChange={(value) => {
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
          itemStyle={pickerStyle.pickerItem}
        >
          {hairHeightData.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>

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
              source={require("../../assets/icons/arrow-right.svg")}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
