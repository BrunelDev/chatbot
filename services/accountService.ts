import apiClient, { handleApiError } from "./apiClient";

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string | null;
  date_of_birth?: string | null;
  is_premium: boolean;
  is_email_verified: boolean;
  subscription_type: "free_trial" | "premium" | "none";
  trial_start_date?: string | null;
  trial_end_date?: string | null;
  is_trial_active: boolean;
  can_use_premium_features: boolean;
  created_at: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  message?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  verification_sent: boolean;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResendCodePayload {
  email: string;
  code_type: "email_verification" | "password_reset";
}

export interface ResendCodeResponse {
  message: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
  refresh: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetRequestResponse {
  message: string;
  email: string;
}

export interface PasswordResetConfirmPayload {
  email: string;
  code: string;
  new_password: string;
  new_password_confirm: string;
}

export interface PasswordResetConfirmResponse {
  message: string;
}

export type UpdateProfilePayload = Partial<
  Pick<User, "phone" | "date_of_birth">
>;

export interface UserActivity {
  id: number;
  activity_type: string;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface UserActivitiesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserActivity[];
}

export interface SubscriptionStatus {
  is_premium: boolean;
  subscription_type: string;
  trial_active: boolean;
  can_use_premium: boolean;
  trial_end_date: string | null;
  email_verified: boolean;
}

// #endregion

// #region -------- API FUNCTIONS --------

const accountService = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    try {
      console.log(payload);
      const { data } = await apiClient.post<RegisterResponse>(
        "/auth/register/",
        payload
      );

      return data;
    } catch (error) {
      throw handleApiError(error, "Registration failed.");
    }
  },

  verifyEmail: async (payload: VerifyEmailPayload): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        "/auth/verify-email/",
        payload
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Email verification failed.");
    }
  },

  resendCode: async (
    payload: ResendCodePayload
  ): Promise<ResendCodeResponse> => {
    try {
      const { data } = await apiClient.post<ResendCodeResponse>(
        "/auth/resend-code/",
        payload
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to resend code.");
    }
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const { data } = await apiClient.post<AuthResponse>(
        "/auth/login/",
        payload
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Login failed.");
    }
  },

  refreshToken: async (
    payload: RefreshTokenPayload
  ): Promise<TokenRefreshResponse> => {
    try {
      const { data } = await apiClient.post<TokenRefreshResponse>(
        "/auth/token/refresh/",
        payload
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to refresh token.");
    }
  },

  requestPasswordReset: async (
    payload: PasswordResetRequestPayload
  ): Promise<PasswordResetRequestResponse> => {
    try {
      const { data } = await apiClient.post<PasswordResetRequestResponse>(
        "/auth/password-reset/request/",
        payload
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to request password reset.");
    }
  },

  confirmPasswordReset: async (
    payload: PasswordResetConfirmPayload
  ): Promise<PasswordResetConfirmResponse> => {
    try {
      const { data } = await apiClient.post<PasswordResetConfirmResponse>(
        "/auth/password-reset/confirm/",
        payload
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to confirm password reset.");
    }
  },

  getProfile: async (): Promise<User> => {
    try {
      const { data } = await apiClient.get<User>("/auth/profile/");
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch profile.");
    }
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    try {
      const { data } = await apiClient.patch<User>("/auth/profile/", payload);
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to update profile.");
    }
  },

  getActivities: async (): Promise<UserActivitiesResponse> => {
    try {
      const { data } =
        await apiClient.get<UserActivitiesResponse>("/auth/activities/");
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch activities.");
    }
  },

  getSubscriptionStatus: async (): Promise<SubscriptionStatus> => {
    try {
      const { data } = await apiClient.get<SubscriptionStatus>(
        "/auth/subscription-status/"
      );
      return data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch subscription status.");
    }
  },
};

export default accountService;

// #endregion
