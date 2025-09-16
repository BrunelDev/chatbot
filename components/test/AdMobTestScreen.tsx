import BannerAdComponent from "@/components/ads/BannerAdComponent";
import InterstitialAdService from "@/services/interstitialAdService";
import RewardedAdService from "@/services/rewardedAdService";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function AdMobTestScreen() {
  const [interstitialLoaded, setInterstitialLoaded] = useState(false);
  const [rewardedLoaded, setRewardedLoaded] = useState(false);

  useEffect(() => {
    // Load ads when component mounts
    loadAds();
  }, []);

  const loadAds = async () => {
    await InterstitialAdService.loadAd();
    await RewardedAdService.loadAd();

    setInterstitialLoaded(InterstitialAdService.isAdLoaded());
    setRewardedLoaded(RewardedAdService.isAdLoaded());
  };

  const showInterstitialAd = async () => {
    const success = await InterstitialAdService.showAd();
    if (success) {
      Alert.alert("Success", "Interstitial ad shown successfully!");
    } else {
      Alert.alert("Error", "Failed to show interstitial ad");
    }
  };

  const showRewardedAd = async () => {
    const success = await RewardedAdService.showAd();
    if (success) {
      Alert.alert("Success", "Rewarded ad shown successfully!");
    } else {
      Alert.alert("Error", "Failed to show rewarded ad");
    }
  };

  return (
    <View className="flex-1 bg-candlelight-50 p-4">
      <Text className="text-2xl font-bold text-center mb-8 text-typography-black">
        AdMob Test Screen
      </Text>

      {/* Banner Ad */}
      <View className="mb-8">
        <Text className="text-lg font-semibold mb-4 text-typography-black">
          Banner Ad:
        </Text>
        <BannerAdComponent />
      </View>

      {/* Interstitial Ad */}
      <View className="mb-8">
        <Text className="text-lg font-semibold mb-4 text-typography-black">
          Interstitial Ad:
        </Text>
        <TouchableOpacity
          onPress={showInterstitialAd}
          disabled={!interstitialLoaded}
          className={`py-3 px-6 rounded-xl ${
            interstitialLoaded ? "bg-primary-500" : "bg-gray-400"
          }`}
        >
          <Text className="text-white font-semibold text-center">
            {interstitialLoaded ? "Show Interstitial Ad" : "Loading..."}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rewarded Ad */}
      <View className="mb-8">
        <Text className="text-lg font-semibold mb-4 text-typography-black">
          Rewarded Ad:
        </Text>
        <TouchableOpacity
          onPress={showRewardedAd}
          disabled={!rewardedLoaded}
          className={`py-3 px-6 rounded-xl ${
            rewardedLoaded ? "bg-secondary-500" : "bg-gray-400"
          }`}
        >
          <Text className="text-white font-semibold text-center">
            {rewardedLoaded ? "Show Rewarded Ad" : "Loading..."}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Reload Button */}
      <TouchableOpacity
        onPress={loadAds}
        className="py-3 px-6 rounded-xl bg-envy-500"
      >
        <Text className="text-white font-semibold text-center">
          Reload All Ads
        </Text>
      </TouchableOpacity>
    </View>
  );
}

