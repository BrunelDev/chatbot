import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  isAxiosError,
} from "axios";
import { router } from "expo-router";
import { AuthResponse } from "./accountService";
import { QuotaError, QuotaExceededError } from "./chatBotService";

// Interface pour les réponses d'erreur de l'API
interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  subscription_status?: string;
  daily_quota?: number;
  remaining_requests?: number;
  ai_model?: string;
  upgrade_required?: boolean;
  data?: Record<string, string[] | string>;
  details?: string;
}

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 100000, // 1 minute
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Promise pour éviter les race conditions lors du refresh token
let refreshTokenPromise: Promise<string> | null = null;

// Fonction pour déconnecter l'utilisateur
const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem("userInfo");
    // Utilisation de router.replace pour naviguer vers la page de login
    router.replace("/(auth)/login");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// Fonction pour rafraîchir le token
const refreshAccessToken = async (): Promise<string> => {
  const userInfoString = await AsyncStorage.getItem("userInfo");

  if (!userInfoString) {
    throw new Error("No user info found");
  }

  const userInfo: AuthResponse = JSON.parse(userInfoString);
  const { refresh } = userInfo;

  if (!refresh) {
    throw new Error("No refresh token available");
  }

  // Utilisation de la baseURL configurée
  const { data } = await axios.post<{ access: string; refresh?: string }>(
    `${apiClient.defaults.baseURL}auth/token/refresh/`,
    { refresh }
  );

  const newAccessToken = data.access;
  const newRefreshToken = data.refresh;

  // Mise à jour du userInfo avec les nouveaux tokens
  userInfo.access = newAccessToken;
  if (newRefreshToken) {
    userInfo.refresh = newRefreshToken;
  }

  await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));

  // Mise à jour du header par défaut
  apiClient.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${newAccessToken}`;

  return newAccessToken;
};

// Intercepteur de requête : ajoute le token d'accès
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const userInfoString = await AsyncStorage.getItem("userInfo");
      if (userInfoString) {
        const userInfo: Partial<AuthResponse> = JSON.parse(userInfoString);
        if (userInfo.access) {
          config.headers.Authorization = `Bearer ${userInfo.access}`;
        }
      }
    } catch (e) {
      console.error(
        "Error reading user info from AsyncStorage or parsing JSON:",
        e
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponse : gère le refresh token sur 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Vérification si c'est une erreur 401 et si ce n'est pas déjà une tentative de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gestion des race conditions : une seule tentative de refresh à la fois
        if (!refreshTokenPromise) {
          refreshTokenPromise = refreshAccessToken();
        }

        const newAccessToken = await refreshTokenPromise;
        refreshTokenPromise = null;

        // Mise à jour du header pour la requête originale
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Retry de la requête originale
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        console.error("Unable to refresh token, logging out:", refreshError);
        refreshTokenPromise = null;
        await logoutUser();
        return Promise.reject(refreshError);
      }
    }

    // Pour toutes les autres erreurs
    return Promise.reject(error);
  }
);

export class ValidationError extends Error {
  errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    // Create a meaningful message by joining all error messages
    const message = Object.values(errors).flat().join("\n");
    super(message || "Validation Error");
    this.name = "ValidationError";
    this.errors = errors;
  }
}

/**
 * Gestionnaire d'erreur API centralisé.
 * @param error L'objet erreur capturé dans le bloc catch.
 * @param customMessage Un message personnalisé convivial à afficher.
 * @returns Un nouvel objet Error avec un message formaté.
 */
export const handleApiError = (
  error: unknown,
  customMessage: string
): Error => {
  if (isAxiosError<ApiErrorResponse>(error) && error.response) {
    // Log détaillé pour le débogage
    console.error("API Error:", {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });

    const responseData = error.response.data;

    // Gestion des erreurs de validation (400)
    if (error.response.status === 400 && responseData) {
      // Cas standard DRF: { field: ["error1"], field2: ["error2"] }
      // On vérifie si responseData ressemble à un objet d'erreurs.
      // On exige qu'au moins une valeur soit un tableau pour éviter de capturer { detail: "msg" }
      const values = Object.values(responseData);
      const hasArrayErrors = values.some((val) => Array.isArray(val));
      const areValuesValid = values.every(
        (val) => Array.isArray(val) || typeof val === "string"
      );

      // Important: On s'assure que ce n'est PAS le format standard (error/message)
      const isStandardError =
        "error" in responseData || "message" in responseData;

      if (hasArrayErrors && areValuesValid && !isStandardError) {
        const normalizedErrors: Record<string, string[]> = {};
        Object.entries(responseData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            normalizedErrors[key] = value;
          } else if (typeof value === "string") {
            normalizedErrors[key] = [value];
          }
        });
        return new ValidationError(normalizedErrors);
      }
    }

    // Vérification si c'est une erreur de quota
    if (
      responseData?.error &&
      responseData?.subscription_status &&
      responseData?.daily_quota !== undefined &&
      responseData?.remaining_requests !== undefined
    ) {
      // ... (existing quota logic)
      const quotaError: QuotaError = {
        error: responseData.error,
        message:
          responseData.message || responseData.detail || "Quota exceeded",
        subscription_status: responseData.subscription_status as
          | "free_trial"
          | "premium",
        remaining_requests: responseData.remaining_requests,
        daily_quota: responseData.daily_quota,
        ai_model: responseData.ai_model || "unknown",
        upgrade_required: responseData.upgrade_required ?? false,
      };
      return new QuotaExceededError(quotaError);
    }

    // Extraction du message d'erreur avec ordre de priorité pour le format Standard
    let apiErrorMessage = customMessage;

    if (responseData?.message) {
      apiErrorMessage = responseData.message;
    } else if (responseData?.error) {
      // Si "error" est présent, on l'utilise si message n'est pas défini
      apiErrorMessage = responseData.error;
    } else if (responseData?.detail) {
      apiErrorMessage = responseData.detail;
    } else if (responseData?.data) {
      // Gestion des erreurs spécifiques aux champs (cas fallback)
      const fieldErrors = responseData.data;
      const errorMessages: string[] = [];

      Object.keys(fieldErrors).forEach((field) => {
        const fieldErrorArray = fieldErrors[field];
        if (Array.isArray(fieldErrorArray)) {
          // @ts-ignore
          errorMessages.push(...fieldErrorArray);
        } else if (typeof fieldErrorArray === "string") {
          errorMessages.push(fieldErrorArray);
        }
      });

      if (errorMessages.length > 0) {
        apiErrorMessage = errorMessages.join(". ");
      }
    }

    // Log des détails techniques si présents (debug only)
    if (responseData?.details) {
      console.log("Error Details:", responseData.details);
    }

    return new Error(apiErrorMessage);
  }

  // Gestion des erreurs réseau ou autres erreurs inattendues
  console.error("An unexpected error occurred:", error);
  return new Error(
    customMessage || "An unexpected network error occurred. Please try again."
  );
};

export default apiClient;
