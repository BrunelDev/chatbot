import profileService, { BioHairProfile } from "@/services/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useHairProfile = () => {
  const [hairProfile, setHairProfile] = useState<BioHairProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const storedProfile = await AsyncStorage.getItem("hairProfile");
        if (storedProfile) {
          setHairProfile(JSON.parse(storedProfile) as BioHairProfile);
        } else {
          const hairResponse = await profileService.getBioProfile();
          await AsyncStorage.setItem(
            "hairProfile",
            JSON.stringify(hairResponse.hair_profile)
          );
          setHairProfile(hairResponse.hair_profile);
        }
      } catch (e) {
        console.error("Failed to load user info from storage", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  return { hairProfile, setHairProfile, isLoading };
};
