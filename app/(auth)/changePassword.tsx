"use client";

import accountService from "@/services/accountService";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { PrimaryButton } from "@/components/buttons/primaryButton";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export default function AuthScreen() {
  const { code, email } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBack = () => {};

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
      Alert.alert("Erreur", "Une erreur est survenue lors de la connexion.");
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
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <ArrowLeft color="#333" size={24} />
              </TouchableOpacity>
              <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.formContainer}>
                <Text style={styles.title} className="text-[#88540B] font-medium">
                  Changer de mot de passe
                </Text>
                <Text style={styles.subtitle}>
                  Au moins 8 caractères, avec des majuscules, des minuscules et
                  des caractères spéciaux.
                </Text>

                <View style={styles.form}>
                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <Lock style={styles.inputIcon} size={18} />
                      <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        onPress={togglePasswordVisibility}
                        style={styles.eyeIcon}
                      >
                        {showPassword ? (
                          <EyeOff color="#333" size={18} />
                        ) : (
                          <Eye color="#333" size={18} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                      <Lock style={styles.inputIcon} size={18} />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor="#999"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                      />
                      <TouchableOpacity
                        onPress={toggleConfirmPasswordVisibility}
                        style={styles.eyeIcon}
                      >
                        {showConfirmPassword ? (
                          <EyeOff color="#333" size={18} />
                        ) : (
                          <Eye color="#333" size={18} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Login Button */}
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
          <View className="px-4 mb-4">
            <PrimaryButton
              title="Enregistrer le mot de passe"
              handlePress={handleForgetPassword}
              disabled={!confirmPassword || !password}
              showLoading={true}
              loadingValue="Enregistrement en cours..."
            />
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
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
    fontSize: 16,
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
    fontSize: 16,
    color: "#333",
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
    color: "#666",
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
  },
});
