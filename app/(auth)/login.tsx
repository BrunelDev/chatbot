"use client";

import accountService from "@/services/accountService";
import { ValidationError } from "@/services/apiClient";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import profileService from "@/services/profile";
import RevenueCatService from "@/services/revenueCatService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../ctx";

const { width, height } = Dimensions.get("window");

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const { signIn } = useSession();

  const handleBack = () => {};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setFieldErrors({}); // Reset errors
    try {
      const response = await accountService.login({ email, password });

      // Stocker les informations utilisateur dans AsyncStorage pour compatibilité
      await AsyncStorage.setItem("userInfo", JSON.stringify(response));

      // Créer une session pour le contexte d'authentification
      const sessionData = JSON.stringify({
        access: response.access,
        refresh: response.refresh,
        user: response.user,
      });

      // Sign in avec la session
      signIn(sessionData);

      // Identifier l'utilisateur dans RevenueCat
      try {
        console.log("-------Identifying user in RevenueCat:", response.user.id.toString());
        await RevenueCatService.loginUser(response.user.id.toString());
      } catch (e) {
        console.error("Failed to identify user in RevenueCat:", e);
      }

      // Vérifier si l'utilisateur a un profil capillaire complet
      try {
        const hairResponse = await profileService.getBioProfile();
        await AsyncStorage.setItem(
          "hairProfile",
          JSON.stringify(hairResponse.hair_profile),
        );

        // Si l'utilisateur a un profil complet, rediriger vers la page d'accueil
        if (hairResponse.profile_completed) {
          Alert.alert(
            "Bienvenue !",
            `Content de vous revoir ${
              hairResponse.user_info.first_name ||
              hairResponse.user_info.username
            } ! 🎉`,
            [
              {
                text: "Continuer",
                onPress: () => router.replace("/(tabs)/home"),
              },
            ],
          );
        } else {
          // Sinon, rediriger vers le formulaire de profil capillaire
          Alert.alert(
            "Profil incomplet",
            "Complétez votre profil capillaire pour une expérience personnalisée.",
            [
              {
                text: "Continuer",
                onPress: () => router.replace("/profil_capillaire/formOne"),
              },
            ],
          );
        }
      } catch (profileError) {
        // Si erreur lors de la récupération du profil, rediriger vers le formulaire
        console.warn("Erreur lors de la récupération du profil:", profileError);
        router.replace("/profil_capillaire/formOne");
      }

      console.log(response);
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof ValidationError) {
        console.log("errors fields: ", error.errors);
        if (error.errors.non_field_errors) {
          Alert.alert("Erreur de connexion", error.errors.non_field_errors[0]);
        }
        setFieldErrors(error.errors);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Identifiants invalides.";
        Alert.alert("Erreur de connexion", errorMessage);
      }
    }
  };

  return (
    <View className="bg-[#FEFDE8] h-full">
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View className="px-4">
            <GoBack />
          </View>

          {/* Content */}
          <View className="px-4">
            <View>
              <Text className="text-[#88540B] font-medium mt-10 text-center text-3xl font-borna">
                Connectez-vous!
              </Text>
              <Text className="text-[#4D5962] text-xs leading-4 text-center my-5 font-worksans">
                Heureux de vous revoir! Renseignez vos informations pour vous
                connecter.
              </Text>

              <View style={styles.form}>
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Mail style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Mail"
                      placeholderTextColor="#859BAB"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                {fieldErrors.email && (
                  <Text style={styles.errorText}>{fieldErrors.email[0]}</Text>
                )}

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Lock style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Mot de passe"
                      placeholderTextColor="#859BAB"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={styles.eyeIcon}
                    >
                      {!showPassword ?
                        <EyeOff color="#333" size={18} />
                      : <Eye color="#333" size={18} />}
                    </TouchableOpacity>
                  </View>
                </View>
                {fieldErrors.password && (
                  <Text style={styles.errorText}>
                    {fieldErrors.password[0]}
                  </Text>
                )}

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text
                    style={styles.forgotPasswordText}
                    onPress={() => {
                      router.push({
                        pathname: "/forgetPassword",
                        params: { source: "password_reset", email: email },
                      });
                    }}
                  >
                    Mot de passe oublié
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <PrimaryButton
                  title="Se connecter"
                  handlePress={handleLogin}
                  disabled={!email || !password}
                  showLoading={true}
                  loadingValue="Connexion en cours..."
                />

                {/* Sign Up Link */}
              </View>
            </View>
          </View>
          <View className="flex flex-row items-center justify-center mt-auto">
            <Text className="text-[#4D5962]  text-xs">
              Vous êtes nouveau ?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/register");
              }}
            >
              <Text style={styles.signupLink}>S&apos;inscrire</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
  },
  formContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 50,
    minHeight: height * 0.6,
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
    color: "#666",
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: "WorkSans",
  },
  eyeIcon: {
    padding: 5,
  },
  eyeIconText: {
    fontSize: 18,
    color: "#666",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -10,
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#587950",
    fontFamily: "WorkSans",
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    color: "#A46C04",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontFamily: "WorkSans",
  },
});
