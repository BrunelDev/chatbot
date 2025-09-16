import { GoBack } from "@/components/headers/goBack";
import { SubTitle, Title } from "@/components/textComponents/title";
import {
  HAIR_LENGTH_CHOICES,
  HAIR_TYPE_CHOICES,
  ROUTINE_STATUS_CHOICES,
  useFormStore,
} from "@/context/useFormStore";
import profileService from "@/services/profile";
import WheelPicker from "@quidone/react-native-wheel-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const routineFrequencyData = [
  {
    value: ROUTINE_STATUS_CHOICES.Definie,
    label: "Oui, j'ai une routine bien définie",
  },
  {
    value: ROUTINE_STATUS_CHOICES.Irreguliere,
    label: "J’en ai une mais je ne suis pas régulière",
  },
  { value: ROUTINE_STATUS_CHOICES.Debutante, label: "Non, je débute" },
];
const data = [...Array(100).keys()].map((index) => ({
  value: index,
  label: index.toString(),
}));
export default function FormFive() {
  const {
    goals,
    hairType,
    hairHeight,
    hairProblems,
    routineFrequency,
    scalpConditions,
    notes,
    setFormData,
    resetForm,
  } = useFormStore();

  const handleSubmit = async () => {
    /**
     *   goals?: string[];
  hair_type?: string;
  hair_height?: string;
  concerns?: string[];
  routine_status?: string;
     */
    if (
      !hairType ||
      !hairHeight ||
      !goals ||
      !hairProblems ||
      !routineFrequency
    ) {
      //Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      console.log("Champs requis manquants", {
        routineFrequency,
        hairType,
        hairHeight,
        goals,
        hairProblems,
      });
      setFormData({
        hairHeight: HAIR_LENGTH_CHOICES.TresCourts,
        routineFrequency: ROUTINE_STATUS_CHOICES.Debutante,
      });
      //return;
    }

    try {
      console.log("hairType", hairType);
      console.log("hairHeight", hairHeight);
      console.log("goals", goals);
      console.log("hairProblems", hairProblems);
      console.log("routineFrequency", routineFrequency);
      const payload: {
        hair_type?: HAIR_TYPE_CHOICES;
        hair_height?: HAIR_LENGTH_CHOICES;
        goals?: string[];
        concerns?: string[];
        routine_status?: string;
      } = {};
      if (hairType) {
        payload["hair_type"] = hairType;
      }
      await profileService.updateHairProfile({
        hair_type: hairType,
        hair_height: hairHeight,
        goals: goals,
        concerns: hairProblems,
        routine_status: routineFrequency,
      });
      Alert.alert("Succès", "Votre profil capillaire a été créé avec succès.");
      resetForm();
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la création de votre profil."
      );
    }
  };
  //const [value, setValue] = useState(0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-candlelight-50 px-4">
        <SafeAreaView />
        <GoBack />
        <View className="flex flex-col gap-y-4" style={{ marginBottom: 16 }}>
          <Title title="Avez-vous une routine capillaire ?" />
          <SubTitle title="Cette information nous aide à comprendre votre niveau d’expérience et vos habitudes." />
        </View>
        <WheelPicker
          data={routineFrequencyData}
          value={
            routineFrequency == ""
              ? ROUTINE_STATUS_CHOICES.Debutante
              : routineFrequency
          }
          onValueChanged={({ item: { value } }) => {
            console.log("value", value);
            setFormData({ routineFrequency: value });
          }}
          enableScrollByTapOnItem={true}
          itemTextStyle={{
            color: "#121C12",
            fontSize: 14,
            fontWeight: "400",
            lineHeight: 24,
            paddingVertical: "auto",
          }}
        />

        {/* Sticky footer button */}
        <View className="absolute w-full bottom-10 left-4 flex flex-row items-center justify-between ">
          <TouchableOpacity
            className="flex flex-row items-center"
            onPress={async () => {
              await handleSubmit();
            }}
          >
            <Text className="text-[#4D5962] font-medium">Passer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await handleSubmit();
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
      </View>
    </KeyboardAvoidingView>
  );
}
