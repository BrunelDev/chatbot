import { GoBack } from "@/components/headers/goBack";
import accountService, { AuthResponse } from "@/services/accountService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
export default function OtpPage() {
  const { source, email: emailFromParams } = useLocalSearchParams<{
    source: "email_verification" | "password_reset";
    email: string;
  }>();
  // User state from AsyncStorage might still be useful for display purposes or if emailFromParams is not available for some reason.
  const [user, setUser] = useState<AuthResponse | null>(null);
  useEffect(() => {
    const fun = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userInfo");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user info from storage", e);
      }
    };
    fun();
  }, []);

  const effectiveEmail = emailFromParams || user?.user.email;

  const handleOtpSubmission = async (code: string) => {
    if (!effectiveEmail) {
      Alert.alert("Adresse e-mail non disponible.");
      return;
    }

    if (source === "email_verification") {
      await handleVerifyMail(effectiveEmail, code);
      router.push("/(auth)/login");
    } else if (source === "password_reset") {
      // Navigate to a new page to set the new password
      // The actual API call to verify/reset password will happen on that new page

      try {
        const response = await accountService.verifyEmail({
          email: effectiveEmail,
          code,
        });
        router.push({
          pathname: "/(auth)/changePassword",
          params: { email: effectiveEmail, code },
        });
      } catch (error) {
        Alert.alert("Échec de vérification");
        console.error("Failed to verify email:", error);
      }
    } else {
      Alert.alert("Source d'OTP inconnue.");
      console.warn("Unknown OTP source:", source);
    }
  };

  const handleVerifyMail = async (email: string, code: string) => {
    // This function is now specifically for email verification after registration
    try {
      const response = await accountService.verifyEmail({ email, code });
      if (user) {
        const tempUser = user;
        tempUser.access = response.access;
        tempUser.refresh = response.refresh;
        setUser(tempUser);
      }

      if (user) {
        // Ensure user is not null before stringifying
        await AsyncStorage.setItem("userInfo", JSON.stringify(user));
        router.push("/(auth)/login"); // Or wherever users go after email verification
      } else {
        // This case might happen if the user object wasn't properly set before calling handleVerifyMail
        // which could be an issue if emailFromParams was used and user state wasn't fully synced.
        // For registration, the user object should ideally be formed from the registration response + tokens from VerifyMail.
        console.warn(
          "User object was null, could not save to AsyncStorage after verification. Consider creating/updating user object here."
        );
      }
    } catch (error) {
      Alert.alert("Échec de vérification");
      console.error("Failed to verify email:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className="bg-[#FCF8E8] w-full h-full justify-center px-4 gap-y-10 relative">
          <GoBack />
          <SafeAreaView />

          <Text className="text-[#88540B] font-medium text-4xl">
            Code de vérification
          </Text>
          <Text>
            {source === "password_reset"
              ? `Nous avons envoyé un code à ${
                  effectiveEmail || "votre adresse e-mail"
                }. Veuillez le saisir ci-dessous pour continuer le processus de réinitialisation de mot de passe.`
              : `Nous avons envoyé un code à ${
                  effectiveEmail || "votre adresse e-mail"
                }. Veuillez le saisir ci-dessous pour vérifier votre compte.`}
          </Text>
          <OtpInput
            numberOfDigits={4}
            focusColor="#587950"
            autoFocus={false}
            hideStick={true}
            blurOnFilled={true}
            disabled={false}
            type="numeric"
            secureTextEntry={false}
            focusStickBlinkingDuration={500}
            onFocus={() => console.log("Focused")}
            onBlur={() => console.log("Blurred")}
            onTextChange={(text) => console.log(text)}
            onFilled={async (text) => {
              await handleOtpSubmission(text);
            }}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            textProps={{
              accessibilityRole: "text",
              accessibilityLabel: "OTP digit",
              allowFontScaling: false,
            }}
          />

          <View className="w-full flex flex-row items-center justify-center gap-2">
            <Text className="text-gray-600">
              Vous n&apos;avez pas de code ?
            </Text>
            <Text
              className="text-[#A46C04]"
              onPress={async () => {
                if (!effectiveEmail) {
                  Alert.alert(
                    "Adresse e-mail non disponible pour renvoyer le code."
                  );
                  return;
                }
                try {
                  await accountService.resendCode({
                    email: effectiveEmail,
                    code_type: "email_verification",
                  });
                  Alert.alert("Code de vérification renvoyé avec succès.");
                } catch (error: unknown) {
                  Alert.alert("Échec de renvoi du code de vérification.");
                  console.error("Failed to resend verification code:", error);
                }
              }}
            >
              Renvoyer le code
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
