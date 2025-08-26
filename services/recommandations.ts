import apiClient, { handleApiError } from "./apiClient";

// #region -------- TYPES --------

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

// #endregion

// #region -------- API FUNCTIONS --------

const recommendationService = {
  getHomeData: async (): Promise<HomeResponse> => {
    try {
      const { data } = await apiClient.get<HomeResponse>(
        "/api/profiles/home/"
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to load home data.");
    }
  },
};

export default recommendationService;

// #endregion
