import mobileAds from "react-native-google-mobile-ads";

class AdMobService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      await mobileAds().initialize();
      this.isInitialized = true;
      console.log("AdMob initialized successfully");
    } catch (error) {
      console.error("AdMob initialization failed:", error);
    }
  }

  isReady() {
    return this.isInitialized;
  }

  // Test Ad Unit IDs (replace with your real ones in production)
  static readonly AD_UNITS = {
    BANNER: {
      ANDROID: "ca-app-pub-3940256099942544/6300978111",
      IOS: "ca-app-pub-9604443161393919~4803099372",
    },
    INTERSTITIAL: {
      ANDROID: "ca-app-pub-3940256099942544/1033173712",
      IOS: "ca-app-pub-9604443161393919~4803099372",
    },
    REWARDED: {
      ANDROID: "ca-app-pub-3940256099942544/5224354917",
      IOS: "ca-app-pub-9604443161393919~4803099372",
    },
  };

  // Get platform-specific ad unit ID
  getAdUnitId(
    adType: "BANNER" | "INTERSTITIAL" | "REWARDED",
    platform: "android" | "ios" = "android"
  ) {
    return AdMobService.AD_UNITS[adType][
      platform.toUpperCase() as "ANDROID" | "IOS"
    ];
  }
}

export default new AdMobService();

