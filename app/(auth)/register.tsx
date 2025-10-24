"use client";

import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import accountService from "@/services/accountService";
import { router } from "expo-router";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react-native";
import React, { useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "../../ctx";

const { width, height } = Dimensions.get("window");

export default function AuthScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const { signIn } = useSession();

  const handleRegister = async () => {
    try {
      const response = await accountService.register({
        email,
        name: username,
        password,
        password_confirm: password,
      });

      // Pour l'inscription, on ne connecte pas automatiquement l'utilisateur
      // car il doit d'abord vérifier son email via OTP
      // La session sera créée après la vérification OTP réussie

      router.push({
        pathname: "/otpPage",
        params: { source: "email_verification", email: email },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
      Alert.alert("Attention", "Votre mot de passe est courant")
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                Inscrivez-vous!
              </Text>
              <Text className="text-[#4D5962] text-xs leading-4 text-center my-5 font-worksans">
                Bienvenu sur notre app. Renseignez vos informations pour créer
                votre compte.
              </Text>

              <View style={styles.form}>
                {/* Nom Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <User style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nom"
                      placeholderTextColor="#859BAB"
                      value={username}
                      onChangeText={setUsername}
                      keyboardType="default"
                      autoCapitalize="words"
                    />
                  </View>
                </View>

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
                      {!showPassword ? (
                        <EyeOff color="#333" size={18} />
                      ) : (
                        <Eye color="#333" size={18} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Register Button */}
                <PrimaryButton
                  title="Créer mon compte"
                  handlePress={handleRegister}
                  disabled={!email || !password || !username}
                  showLoading={true}
                  loadingValue="Création en cours..."
                />

                {/* Sign Up Link */}
              </View>
            </View>
          </View>
          <View className="flex flex-row items-center justify-center mt-auto">
            <Text className="text-[#4D5962] text-xs">
              Vous avez déjà un compte ?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/login");
              }}
            >
              <Text style={styles.signupLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
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
  signupLink: {
    fontSize: 14,
    color: "#A46C04",
  },
});
