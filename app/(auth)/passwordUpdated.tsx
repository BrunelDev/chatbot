import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const PasswordUpdatedScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#FCF8E8] justify-center items-center">
      <View className="items-center px-8 w-full">
        <Image
          style={{ width: 80, height: 80 }}
          source={require("../../assets/icons/Successmark.svg")}
          className="w-24 h-24 mb-8"
        />
        <Text className="text-2xl font-bold text-[#88540B] mt-8 font-borna">
          Mot de passe modifié
        </Text>
        <Text className="text-center text-gray-500 mt-2 text-base">
          Votre mot de passe a été modifié avec succès
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/(auth)/login")}
          className="bg-[#587950] w-full py-4 rounded-xl mt-12"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Continuer
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PasswordUpdatedScreen;
