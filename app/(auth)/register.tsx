"use client";

import { PrimaryButton } from "@/components/buttons/primaryButton";
import accountService from "@/services/accountService";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleRegister = async () => {
    try {
      const response = await accountService.register({
        email,
        password,
        password_confirm: passwordConfirm,
      });
      console.log(response);
    } catch (error) {
      Alert.alert("Erreur", "Une erreur est survenue lors de la connexion.");
    }
  };

  const handleBack = () => {};

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
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.formContainer}>
              <Text style={styles.title} className="text-[#88540B]">
                Inscrivez-vous!
              </Text>
              <Text style={styles.subtitle}>
                Bienvenu sur notre app. Renseignez vos informations pour créer
                votre compte.
              </Text>

              <View style={styles.form}>
                {/* Email Input */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>✉</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Mail"
                      placeholderTextColor="#999"
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
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Mot de passe"
                      placeholderTextColor="#999"
                      value={password}
                      onChangeText={setPassword}
                      keyboardType="default"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={styles.eyeIcon}
                    >
                      <Text style={styles.eyeIconText}>
                        {showPassword ? "👁" : "👁"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Mot de passe"
                      placeholderTextColor="#999"
                      value={passwordConfirm}
                      keyboardType="default"
                      onChangeText={(text) => setPasswordConfirm(text)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={togglePasswordVisibility}
                      style={styles.eyeIcon}
                    >
                      <Text style={styles.eyeIconText}>
                        {showPassword ? <Eye /> : <EyeOff />}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Login Button */}
                <PrimaryButton
                  title="Créer mon compte"
                  handlePress={handleRegister}
                  disabled={!email || !password || !passwordConfirm}
                  showLoading={true}
                  loadingValue="Création en cours..."
                  activeOpacity={0.8}
                  className="w-full"
                />

                {/* Sign Up Link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>
                    Vous avez déjà un compte!
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      router.push("/login");
                    }}
                  >
                    <Text style={styles.signupLink}>Se connecter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
  backArrow: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
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
