import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { isAxiosError } from "axios";
import { AuthResponse } from "./accountService";
const apiClient = axios.create({
  //baseURL: process.env.EXPO_PUBLIC_API_URL,
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 and if it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as a retry

      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        if (!userInfoString) {
          // If no user info, can't refresh, so just reject
          return Promise.reject(error);
        }

        const userInfo: AuthResponse = JSON.parse(userInfoString);
        const { refresh } = userInfo;

        if (!refresh) {
          // No refresh token available, logout user
          await AsyncStorage.removeItem("userInfo");
          // Here you might want to navigate the user to the login screen
          return Promise.reject(error);
        }

        // Request a new access token using the refresh token
        const { data } = await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}auth/token/refresh/`,
          {
            refresh: refresh,
          }
        );

        const newAccessToken = data.access;
        const newRefreshToken = data.refresh; // Check for a new refresh token

        // Update the user info with the new tokens
        userInfo.access = newAccessToken;
        if (newRefreshToken) {
          // If the server sent a new refresh token, update it
          userInfo.refresh = newRefreshToken;
        }
        await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));

        // Update the Authorization header for the original request and for subsequent requests
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        apiClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If the refresh token is invalid or the refresh call fails, logout the user
        console.error("Unable to refresh token, logging out:", refreshError);
        await AsyncStorage.removeItem("userInfo");
        // Here you might want to navigate the user to the login screen
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just reject the promise
    return Promise.reject(error);
  }
);

/**
 * A centralized API error handler.
 * @param error The error object caught in the catch block.
 * @param customMessage A custom, user-friendly message to display.
 * @returns A new Error object with a formatted message.
 */
export const handleApiError = (
  error: unknown,
  customMessage: string
): Error => {
  if (isAxiosError(error) && error.response) {
    // Log the detailed error for debugging
    console.error("API Error:", {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });

    // Check if this is a quota error
    const responseData = error.response.data;
    if (
      responseData?.error &&
      responseData?.subscription_status &&
      responseData?.daily_quota !== undefined &&
      responseData?.remaining_requests !== undefined
    ) {
      // This is a quota error - import and throw QuotaExceededError
      const { QuotaExceededError } = require("./chatBotService");
      return new QuotaExceededError(responseData);
    }

    // Extract error message with priority order
    let apiErrorMessage = customMessage;

    // First check for top-level message or detail
    if (error.response.data?.message) {
      apiErrorMessage = error.response.data.message;
    } else if (error.response.data?.detail) {
      apiErrorMessage = error.response.data.detail;
    } else if (error.response.data?.data) {
      // Handle field-specific errors like {"data": {"email": ["Error message"]}}
      const fieldErrors = error.response.data.data;
      const errorMessages: string[] = [];

      // Extract all field error messages
      Object.keys(fieldErrors).forEach((field) => {
        const fieldErrorArray = fieldErrors[field];
        if (Array.isArray(fieldErrorArray)) {
          errorMessages.push(...fieldErrorArray);
        } else if (typeof fieldErrorArray === "string") {
          errorMessages.push(fieldErrorArray);
        }
      });

      if (errorMessages.length > 0) {
        apiErrorMessage = errorMessages.join(". ");
      }
    }

    return new Error(apiErrorMessage);
  }
  // Handle network errors or other unexpected errors
  console.error("An unexpected error occurred:", error);
  return new Error(
    customMessage || "An unexpected network error occurred. Please try again."
  );
};

export default apiClient;
