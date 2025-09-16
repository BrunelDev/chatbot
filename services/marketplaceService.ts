import apiClient, { handleApiError } from "./apiClient";

// #region -------- TYPES --------

export interface MarketplaceUserInfo {
  first_name: string;
  has_profile: boolean;
  hair_type: string;
  main_concerns: string[];
  main_goals: string[];
}

export interface MarketplaceProduct {
  id: number;
  name: string;
  slug: string;
  brand: string;
  price: number;
  image: string;
  rating_average: number;
  short_description: string;
  category: string | null;
  reason?: string; // Only present in recommendations endpoint
}

export interface MarketplaceDashboardResponse {
  user_info: MarketplaceUserInfo;
  categories: string[];
  recommendations: MarketplaceProduct[];
  specialized_sections: any[]; // Define more specifically if needed
  total_products: number;
}

export interface MarketplaceRecommendationsResponse {
  recommendations: MarketplaceProduct[];
  profile_based: boolean;
  hair_type: string;
  main_concerns: string[];
  main_goals: string[];
}

// #region -------- SERVICES --------

const marketplaceService = {
  /**
   * Get marketplace dashboard data
   * Endpoint: GET api/marketplace/explorer/Dashboard/
   */
  getDashboard: async (): Promise<MarketplaceDashboardResponse> => {
    try {
      const { data } = await apiClient.get<MarketplaceDashboardResponse>(
        "/marketplace/explorer/dashboard/"
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to load marketplace dashboard.");
    }
  },

  /**
   * Get personalized recommendations
   * Endpoint: GET api/marketplace/explorer/recommendations/
   */
  getRecommendations: async (): Promise<MarketplaceRecommendationsResponse> => {
    try {
      const { data } = await apiClient.get<MarketplaceRecommendationsResponse>(
        "/marketplace/explorer/recommendations/"
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to load recommendations.");
    }
  },

  /**
   * Get products by category
   * @param category - Category name to filter by
   */
  getProductsByCategory: async (
    category: string
  ): Promise<MarketplaceProduct[]> => {
    try {
      const { data } = await apiClient.get<MarketplaceProduct[]>(
        `/marketplace/explorer/products/?category=${encodeURIComponent(
          category
        )}`
      );
      return data;
    } catch (error) {
      throw handleApiError(
        error,
        `Failed to load products for category: ${category}`
      );
    }
  },

  /**
   * Get all available categories
   */
  getCategories: async (): Promise<string[]> => {
    try {
      const { data } = await apiClient.get<string[]>(
        "/marketplace/explorer/categories/"
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to load categories.");
    }
  },

  /**
   * Search products
   * @param query - Search query
   * @param category - Optional category filter
   */
  searchProducts: async (
    query: string,
    category?: string
  ): Promise<MarketplaceProduct[]> => {
    try {
      let url = `/marketplace/explorer/search/?q=${encodeURIComponent(query)}`;
      if (category) {
        url += `&category=${encodeURIComponent(category)}`;
      }
      const { data } = await apiClient.get<MarketplaceProduct[]>(url);
      return data;
    } catch (error) {
      throw handleApiError(error, `Failed to search products: ${query}`);
    }
  },
};

export default marketplaceService;
