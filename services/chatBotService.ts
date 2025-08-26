import apiClient, { handleApiError } from "./apiClient";

// #region Interfaces

export interface Message {
  id: number;
  message_type: "user" | "assistant";
  content: string;
  audio_file: string | null;
  audio_duration: number | null;
  image_file: string | null;
  metadata: object;
  timestamp: string;
}

export interface ConversationResponse {
  session_id: string;
  user_message: Message;
  ai_response: Message;
  can_use_voice: boolean;
  ai_analysis?: {
    tokens_used: number;
    from_cache: boolean;
    recommendations: any[];
    response_time: number;
  };
}

export interface StartConversationPayload {
  message?: string;
  session_id?: string;
  image_url?: string;
}

export interface Session {
  id: number;
  session_id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  messages: Message[];
  message_count: number;
}

export interface SessionsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Session[];
}

export interface SessionMessagesResponse {
  session_id: string;
  messages: Message[];
}

export interface CreateSessionPayload {
  title: string;
}

// #endregion

// #region API Functions

/**
 * Starts a new conversation or continues an existing one.
 * Can handle text-only, image-only, or mixed content.
 * POST /api/chat/start/
 */
export const startOrContinueConversation = async (
  payload: StartConversationPayload
): Promise<ConversationResponse> => {
  try {
    const { data } = await apiClient.post<ConversationResponse>(
      "/api/chat/start/",
      payload
    );
    return data;
  } catch (error) {
    throw handleApiError(error, "Failed to start or continue conversation");
  }
};

/**
 * Interrupts the AI's response generation.
 * POST /api/chat/interrupt/
 */
export const interruptIa = async (sessionId: string): Promise<void> => {
  try {
    await apiClient.post("/api/chat/interrupt/", { session_id: sessionId });
  } catch (error) {
    throw handleApiError(error, "Failed to interrupt AI");
  }
};

/**
 * Retrieves the list of past conversation sessions.
 * GET /api/chat/sessions/
 */
export const getConversationHistory = async (): Promise<SessionsListResponse> => {
  try {
    const { data } = await apiClient.get<SessionsListResponse>(
      "/api/chat/sessions/"
    );
    return data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch conversation history");
  }
};

/**
 * Deletes a specific conversation session.
 * DELETE /api/chat/sessions/{id}/
 */
export const deleteConversationSession = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/chat/sessions/${id}/`);
  } catch (error) {
    throw handleApiError(error, "Failed to delete session");
  }
};

/**
 * Retrieves all messages for a specific session.
 * GET /api/chat/sessions/{session_id}/messages/
 */
export const getFullConversation = async (
  sessionId: string
): Promise<SessionMessagesResponse> => {
  try {
    const { data } = await apiClient.get<SessionMessagesResponse>(
      `/api/chat/sessions/${sessionId}/messages/`
    );
    return data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch full conversation");
  }
};

/**
 * Creates a new conversation session.
 * POST /api/chat/sessions/
 */
export const createConversationSession = async (
  payload: CreateSessionPayload
): Promise<Session> => {
  try {
    const { data } = await apiClient.post<Session>("/api/chat/sessions/", payload);
    return data;
  } catch (error) {
    throw handleApiError(error, "Failed to create new session");
  }
};

// #endregion
