import { GoBack } from "@/components/headers/goBack";
import accountService, { AuthResponse } from "@/services/accountService";
import RevenueCatService from "@/services/revenueCatService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../ctx";
export default function OtpPage() {
  const { source, email: emailFromParams } = useLocalSearchParams<{
    source: "email_verification" | "password_reset";
    email: string;
  }>();
  const { signIn } = useSession();

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
      // La redirection est maintenant gérée dans handleVerifyMail
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
        const errorMessage =
          error instanceof Error ? error.message : "Échec de vérification";
        Alert.alert(errorMessage);
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

        // Créer une session pour le contexte d'authentification
        const sessionData = JSON.stringify({
          access: response.access,
          refresh: response.refresh,
          user: tempUser.user,
        });

        // Sign in avec la session
        signIn(sessionData);

        // Stocker aussi dans AsyncStorage pour compatibilité
        await AsyncStorage.setItem("userInfo", JSON.stringify(tempUser));

        // Identifier l'utilisateur dans RevenueCat
        try {
          await RevenueCatService.loginUser(tempUser.user.id.toString());
        } catch (e) {
          console.error("Failed to identify user in RevenueCat:", e);
        }

        // Rediriger vers l'app principal maintenant que l'utilisateur est connecté
        router.replace("/(tabs)/home");
      } else {
        // Si pas d'utilisateur stocké, créer une session basique
        const sessionData = JSON.stringify({
          access: response.access,
          refresh: response.refresh,
          user: { email: email },
        });

        signIn(sessionData);
        router.replace("/(auth)/login");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Échec de vérification";
      Alert.alert(errorMessage);
      console.error("Failed to verify email:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView
          className="bg-[#FCF8E8] w-full h-full justify-center px-4 gap-y-10 relative"
          edges={["top"]}
        >
          <GoBack />

          <Text className="text-[#88540B] font-medium text-4xl font-borna">
            Code de vérification
          </Text>
          <Text>
            {source === "password_reset" ?
              `Nous avons envoyé un code à ${
                effectiveEmail || "votre adresse e-mail"
              }. Veuillez le saisir ci-dessous pour continuer le processus de réinitialisation de mot de passe.`
            : `Nous avons envoyé un code à ${
                effectiveEmail || "votre adresse e-mail"
              }. Veuillez le saisir ci-dessous pour vérifier votre compte.`
            }
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
              className="text-[#A46C04] font-borna"
              onPress={async () => {
                if (!effectiveEmail) {
                  Alert.alert(
                    "Adresse e-mail non disponible pour renvoyer le code.",
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
                  const errorMessage =
                    error instanceof Error ?
                      error.message
                    : "Échec de renvoi du code de vérification.";
                  Alert.alert(errorMessage);
                  console.error("Failed to resend verification code:", error);
                }
              }}
            >
              Renvoyer le code
            </Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
