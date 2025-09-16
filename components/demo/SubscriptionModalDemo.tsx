import PremiumSubscriptionModal from "@/components/modals/PremiumSubscriptionModal";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SubscriptionModalDemoProps {
  // This is just for testing purposes
}

export default function SubscriptionModalDemo({}: SubscriptionModalDemoProps) {
  const [showModal, setShowModal] = React.useState(false);

  const handleUpgrade = () => {
    console.log("User wants to upgrade to premium!");
    setShowModal(false);
    // Here you would implement your premium upgrade logic
    // For example: navigate to subscription page, handle payment, etc.
  };

  return (
    <View className="flex-1 justify-center items-center bg-candlelight-50 p-4">
      <Text className="text-2xl font-bold text-typography-black mb-8 text-center">
        Test Subscription Modal
      </Text>

      <TouchableOpacity
        onPress={() => setShowModal(true)}
        className="bg-primary-500 px-8 py-4 rounded-xl"
      >
        <Text className="text-white font-semibold text-lg">
          Show Subscription Modal
        </Text>
      </TouchableOpacity>

      <PremiumSubscriptionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onUpgrade={handleUpgrade}
      />
    </View>
  );
}
