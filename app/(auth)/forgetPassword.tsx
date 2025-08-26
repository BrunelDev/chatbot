import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import accountService from "@/services/accountService";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const handleRequestPasswordReset = async () => {
    try {
      await accountService.requestPasswordReset({ email });
      router.push({
        pathname: "/(auth)/otpPage",
        params: { source: "password_reset", email },
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        Alert.alert(
          "Une erreur est survenue lors de la réinitialisation du mot de passe.",
          error.message
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      className="bg-[#FEFDE8]"
    >
      <SafeAreaView className="flex-1">
        <GoBack />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1 justify-center px-4 gap-y-10">
            <Text className="text-[#88540B] font-medium text-4xl">
              Mot de passe oublié
            </Text>
            <Text>
              Veuillez sélectionner vos coordonnées et nous vous enverrons un
              code de vérification pour réinitialiser votre mot de passe
            </Text>
            <View className="relative">
              <TextInput
                placeholderTextColor={"#02244099"}
                cursorColor={"#FF9432"}
                className="bg-[#E5EAE1] h-20 rounded-xl pl-12 pr-4 placeholder:font-urbanist"
                placeholder="Votre email"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                returnKeyType="done"
              />
              <View className="absolute top-1/2 left-3 -translate-y-1/2">
                <Image
                  source={require("../../assets/icons/mail.svg")}
                  contentFit="cover"
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View className="px-4 pb-4 mt-20">
          <PrimaryButton
            title={"Envoyer le code de vérification"}
            handlePress={async() => {
              await handleRequestPasswordReset();
            }}
            showLoading={true}
            disabled={email === ""}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
