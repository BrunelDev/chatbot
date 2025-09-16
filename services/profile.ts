import { HAIR_CONCERNS_CHOICES, HAIR_LENGTH_CHOICES, HAIR_TYPE_CHOICES, ROUTINE_STATUS_CHOICES } from "@/context/useFormStore";
import apiClient, { handleApiError } from "./apiClient";

// #region -------- TYPES --------

export interface CreateHairProfilePayload {
  goals?: string[];
  hair_type?: string;
  hair_height?: string;
  concerns?: string[];
  routine_status?: string;
}

export interface HairConcernOption {
  value: string;
  label: string;
}

export interface HairProfileResponse {
  id: number;
  user: number;
  goals: string[];
  hair_type: string;
  hair_type_display: string;
  hair_length: string;
  hair_length_display: string;
  concerns: string[];
  available_concerns: HairConcernOption[];
  routine_status: string;
  routine_status_display: string;
  porosity: string;
  porosity_display: string;
  density: string;
  density_display: string;
  thickness: string;
  thickness_display: string;
  created_at: string;
  updated_at: string;
}

export interface HomeUserInfo {
  name: string;
  profile_complete: boolean;
}

export interface RecommendedProduct {
  id: number;
  name: string;
  description: string;
  price: string; // keep as string per API
  image: string;
  rating: number;
  brand: string;
  reasons: string[];
  score: number;
  is_on_sale: boolean;
}

export interface DailyTip {
  category: string;
  title: string;
  description: string;
  frequency: string;
}

export interface HomeResponse {
  user: HomeUserInfo;
  recommended_products: RecommendedProduct[];
  daily_tips: DailyTip[];
  greeting: string;
}

export interface BioHairProfile {
  hair_type: HAIR_TYPE_CHOICES ;
  hair_length: HAIR_LENGTH_CHOICES;
  concerns: HAIR_CONCERNS_CHOICES[];
  goals: string[];
  routine_status: ROUTINE_STATUS_CHOICES;
  porosity: string;
  density: string;
  thickness: string;
  created_at: string;
  updated_at: string;
}

interface BioUserInfo {
  first_name: string;
  username: string;
  profile_picture: string | null;
}

export interface BioProfileResponse {
  bio: string;
  hair_profile: BioHairProfile;
  bio_generated_at: string;
  profile_completed: boolean;
  user_info: BioUserInfo;
}

// #endregion

// #region -------- API FUNCTIONS --------

const profileService = {
  updateHairProfile: async (
    payload: CreateHairProfilePayload
  ): Promise<HairProfileResponse> => {
    try {
      const { data } = await apiClient.patch<HairProfileResponse>(
        "/profiles/hair/",
        payload
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to create hair profile.");
    }
  },
  getHome: async (): Promise<HomeResponse> => {
    try {
      const { data } = await apiClient.get<HomeResponse>("/profiles/home/");
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to load home profile data.");
    }
  },

  getBioProfile: async (): Promise<BioProfileResponse> => {
    try {
      const { data } = await apiClient.get<BioProfileResponse>(
        "/auth/bio-profile/"
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch bio profile.");
    }
  },
};

export default profileService;

// #endregion
