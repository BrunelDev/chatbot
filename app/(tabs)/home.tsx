import { PrimaryButton } from "@/components/buttons/primaryButton";
import accountService from "@/services/accountService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React from "react";
import { Alert, Text, View } from "react-native";

export default function HomeScreen() {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      router.replace("/(auth)/login");
      Alert.alert("Déconnexion", "Vous avez été déconnecté avec succès.");
    } catch (error) {
      console.error("Failed to logout:", error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la déconnexion. Veuillez réessayer.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await accountService.deleteAccount();
              Alert.alert("Suppression", response.message);
              await AsyncStorage.removeItem("accessToken");
              await AsyncStorage.removeItem("refreshToken");
              router.replace("/(auth)/login");
            } catch (error: any) {
              Alert.alert(
                "Erreur",
                error.message ||
                  "Une erreur est survenue lors de la suppression de votre compte."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-white">
      <Text className="text-2xl font-bold mb-5">Accueil</Text>
      <PrimaryButton
        title="Déconnexion"
        handlePress={handleLogout}
        className="w-full"
      />
      <View className="h-5" />
      <PrimaryButton
        title="Supprimer le compte"
        handlePress={handleDeleteAccount}
        className="w-full"
      />
    </View>
  );
}
