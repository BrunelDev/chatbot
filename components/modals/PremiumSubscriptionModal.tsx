import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface PremiumSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function PremiumSubscriptionModal({
  visible,
  onClose,
  onUpgrade,
}: PremiumSubscriptionModalProps) {
  const features = [
    {
      title:
        "Accédez à toutes les réponses et recommandations de l'IA, sans aucune restriction.",
      hasRestrictionRemoval: true,
    },
    {
      title: "Recommandations capillaires personnalisées",
      hasRestrictionRemoval: false,
    },
    {
      title: "Accès exclusif aux astuces avancées",
      hasRestrictionRemoval: false,
    },
  ];
  const [isModalvisible, setIsModalVisible] = useState(visible);
  useFocusEffect(
    useCallback(() => {
      setIsModalVisible(visible);
    }, [visible])
  );

  return (
    <Modal
      visible={isModalvisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#FEFDE8" }}
          edges={["right", "top", "left"]}
        >
          <View className="flex-1 bg-candlelight-50 justify-center items-center w-full">
            {/* Modal Content */}
            <View className="rounded-2xl  w-full overflow-hidden flex-1">
              {/* Close Button */}
              <TouchableOpacity
                onPress={() => {
                  console.log("Close button pressed");
                  onClose();
                  setIsModalVisible(false);
                }}
                className="absolute top-4 right-4 z-10 bg-white/20 rounded-full p-2"
              >
                <X size={20} color="#181718" />
              </TouchableOpacity>

              {/* Hero Image Section */}
              <View className="h-[60%] bg-gray-200 relative">
                <Image
                  source={require("../../assets/images/premium-bg.jpg")}
                  className="w-full h-full"
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              </View>

              {/* Content Section */}
              <View className="p-6 pb-20 bg-candlelight-50 rounded-[28px] overflow-hidden absolute w-full top-[47%] ">
                {/* Brand Tag */}
                <View className="items-center mb-4">
                  <View className="bg-candlelight-100 px-4 py-2 ">
                    <Text className="text-envy-800 font-medium text-sm">
                      Boucles en Poésie
                    </Text>
                  </View>
                </View>

                {/* Price */}
                <View className="mb-6 flex-row items-center gap-2">
                  <Text className="text-envy-500 text-4xl font-medium font-borna">
                    $5
                  </Text>
                  <Text className="text-xl font-medium text-envy-500 font-borna">
                    / mois
                  </Text>
                </View>

                {/* Features List */}
                <View className="gap-y-4 mb-8">
                  {features.map((feature, index) => (
                    <View key={index} className="flex-row gap-2">
                      <Image
                        source={require("../../assets/icons/checkbox-circle-fill.svg")}
                        style={{ width: 24, height: 24 }}
                        contentFit="cover"
                      />
                      <View className="flex-1">
                        <Text className="text-sm leading-5 text-[#5B6B78] font-medium">
                          {feature.title}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Upgrade Button */}
                <TouchableOpacity
                  onPress={onUpgrade}
                  className="bg-envy-500 rounded-full flex-row items-center justify-center mb-3 h-[48px]"
                >
                  <Text className="text-[#F4F8F9] font-light text-sm mr-2">
                    Passer en Premium
                  </Text>

                  <Image
                    source={require("../../assets/icons/medal.svg")}
                    style={{ width: 16, height: 16 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                {/* Disclaimer */}
                <TouchableOpacity
                  onPress={() => {
                    router.back();
                  }}
                >
                  <Text className="text-center text-black text-xs">
                    Sans engagement
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}
