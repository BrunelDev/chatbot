import AdMobService from "@/services/adMobService";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

interface BannerAdComponentProps {
  size?: BannerAdSize;
  className?: string;
  style?: any;
}

export default function BannerAdComponent({
  size = BannerAdSize.ADAPTIVE_BANNER,
  className = "",
  style = {},
}: BannerAdComponentProps) {
  const [adUnitId, setAdUnitId] = useState(TestIds.BANNER);

  useEffect(() => {
    // Initialize AdMob if not already done
    AdMobService.initialize();

    // Use test ad unit ID for development
    // Replace with your actual ad unit ID for production
    setAdUnitId(TestIds.BANNER);
  }, []);

  return (
    <View className={`bg-gray-100 ${className}`} style={style}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log("Banner ad loaded");
        }}
        onAdFailedToLoad={(error) => {
          console.error("Banner ad failed to load:", error);
        }}
      />
    </View>
  );
}

