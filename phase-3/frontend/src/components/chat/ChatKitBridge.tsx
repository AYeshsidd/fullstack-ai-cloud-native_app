'use client';

import { apiClient } from '../../lib/api-client';
import {
  getStoredConversationId,
  setStoredConversationId,
  translateBackendMessageToChatKit,
  type ChatKitMessage,
} from '../../lib/chatkit-config';

interface ChatKitBridgeProps {
  userId: string;
  onTodoListRefresh?: () => void;
}

export class ChatKitBridge {
  private userId: string;
  private onTodoListRefresh?: () => void;

  constructor(userId: string, onTodoListRefresh?: () => void) {
    this.userId = userId;
    this.onTodoListRefresh = onTodoListRefresh;
  }

  private translateError(error: string): string {
    // Network errors
    if (error.includes('Failed to fetch') || error.includes('NetworkError')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }

    // Authentication errors
    if (error.includes('401') || error.includes('Unauthorized')) {
      return 'Your session has expired. Please log in again.';
    }

    if (error.includes('403') || error.includes('Forbidden')) {
      return 'You do not have permission to perform this action.';
    }

    // Server errors
    if (error.includes('500') || error.includes('Internal Server Error')) {
      return 'The server encountered an error. Please try again later.';
    }

    if (error.includes('502') || error.includes('503') || error.includes('504')) {
      return 'The server is temporarily unavailable. Please try again in a moment.';
    }

    // Timeout errors
    if (error.includes('timeout') || error.includes('Timeout')) {
      return 'The request took too long. Please try again.';
    }

    // Default: return original error if no match
    return error;
  }

  async sendMessage(message: string, conversationId?: string) {
    const response = await apiClient.sendChatMessage(
      this.userId,
      message,
      conversationId || getStoredConversationId() || undefined
    );

    if (response.success && response.data) {
      // Store conversation_id
      setStoredConversationId(response.data.conversation_id);

      // Check for tool calls
      if (response.data.tool_calls.length > 0) {
        this.onTodoListRefresh?.();
      }

      return {
        message: response.data.response,
        conversationId: response.data.conversation_id,
      };
    }

    throw new Error(this.translateError(response.error || 'Failed to send message'));
  }

  async loadConversationHistory(conversationId: string): Promise<ChatKitMessage[]> {
    const response = await apiClient.getConversationDetail(this.userId, conversationId);

    if (response.success && response.data) {
      return response.data.conversation.messages.map(translateBackendMessageToChatKit);
    }

    throw new Error(this.translateError(response.error || 'Failed to load conversation history'));
  }
}
