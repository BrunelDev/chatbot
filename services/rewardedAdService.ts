import AdMobService from "@/services/adMobService";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

class RewardedAdService {
  private rewardedAd: RewardedAd | null = null;
  private isLoaded = false;

  async loadAd() {
    try {
      // Initialize AdMob if not already done
      await AdMobService.initialize();

      // Create rewarded ad with test ID
      this.rewardedAd = RewardedAd.createForAdRequest(TestIds.REWARDED, {
        requestNonPersonalizedAdsOnly: true,
      });

      // Set up event listeners
      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log("Rewarded ad loaded");
        this.isLoaded = true;
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.ERROR, (error) => {
        console.error("Rewarded ad error:", error);
        this.isLoaded = false;
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.OPENED, () => {
        console.log("Rewarded ad opened");
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
        console.log("Rewarded ad closed");
        this.isLoaded = false;
        // Load a new ad for next time
        this.loadAd();
      });

      this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          console.log("User earned reward:", reward);
          // Handle reward here
        }
      );

      // Load the ad
      this.rewardedAd.load();
    } catch (error) {
      console.error("Failed to load rewarded ad:", error);
    }
  }

  async showAd(): Promise<boolean> {
    if (this.isLoaded && this.rewardedAd) {
      try {
        await this.rewardedAd.show();
        return true;
      } catch (error) {
        console.error("Failed to show rewarded ad:", error);
        return false;
      }
    }
    return false;
  }

  isAdLoaded() {
    return this.isLoaded;
  }
}

export default new RewardedAdService();

