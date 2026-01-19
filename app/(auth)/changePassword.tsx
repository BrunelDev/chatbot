"use client";

import accountService from "@/services/accountService";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/buttons/primaryButton";
import { GoBack } from "@/components/headers/goBack";
import { router, useLocalSearchParams } from "expo-router";
import { Eye, EyeOff, Lock } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export default function AuthScreen() {
  const { code, email } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleForgetPassword = async () => {
    try {
      console.log({
        email,
        code: code as string,
        new_password: password,
        new_password_confirm: confirmPassword,
      });
      const response = await accountService.confirmPasswordReset({
        email: email as string,
        code: code as string,
        new_password: password,
        new_password_confirm: confirmPassword,
      });
      console.log(response);
      Alert.alert(
        "Mot de passe réinitialisé avec succès !",
        "Vous pouvez maintenant vous connecter.",
        [
          {
            text: "OK",
            onPress: () => {
              router.push("/(auth)/passwordUpdated");
            },
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la connexion.";
      Alert.alert("Erreur", errorMessage);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  Changer de mot de passe
                </Text>
                <Text className="text-[#4D5962] text-xs leading-4 text-center my-5 font-worksans">
                  Au moins 8 caractères, avec des majuscules, des minuscules et
                  des caractères spéciaux.
                </Text>

                <View style={styles.form}>
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

                  {/* Confirm Password Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <Lock style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor="#859BAB"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity
                        onPress={toggleConfirmPasswordVisibility}
                        style={styles.eyeIcon}
                      >
                        {!showConfirmPassword ? (
                          <EyeOff color="#333" size={18} />
                        ) : (
                          <Eye color="#333" size={18} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Change Password Button */}
                  <PrimaryButton
                    title="Enregistrer le mot de passe"
                    handlePress={handleForgetPassword}
                    disabled={!confirmPassword || !password}
                    showLoading={true}
                    loadingValue="Enregistrement en cours..."
                  />
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
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
});
