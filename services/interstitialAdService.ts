import AdMobService from "@/services/adMobService";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

class InterstitialAdService {
  private interstitialAd: InterstitialAd | null = null;
  private isLoaded = false;

  async loadAd() {
    try {
      // Initialize AdMob if not already done
      await AdMobService.initialize();

      // Create interstitial ad with test ID
      this.interstitialAd = InterstitialAd.createForAdRequest(
        TestIds.INTERSTITIAL,
        {
          requestNonPersonalizedAdsOnly: true,
        }
      );

      // Set up event listeners
      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log("Interstitial ad loaded");
        this.isLoaded = true;
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error("Interstitial ad error:", error);
        this.isLoaded = false;
      });

      this.interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
        console.log("Interstitial ad opened");
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log("Interstitial ad closed");
        this.isLoaded = false;
        // Load a new ad for next time
        this.loadAd();
      });

      // Load the ad
      this.interstitialAd.load();
    } catch (error) {
      console.error("Failed to load interstitial ad:", error);
    }
  }

  async showAd(): Promise<boolean> {
    if (this.isLoaded && this.interstitialAd) {
      try {
        await this.interstitialAd.show();
        return true;
      } catch (error) {
        console.error("Failed to show interstitial ad:", error);
        return false;
      }
    }
    return false;
  }

  isAdLoaded() {
    return this.isLoaded;
  }
}

export default new InterstitialAdService();

