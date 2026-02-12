'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatKitBridge } from './ChatKitBridge';
import {
  getChatKitDomainKey,
  getStoredConversationId,
  clearStoredConversationId,
} from '../../lib/chatkit-config';

interface ChatKitEmbedProps {
  userId: string;
  onTodoListRefresh?: () => void;
}

export function ChatKitEmbed({ userId, onTodoListRefresh }: ChatKitEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [hasConversation, setHasConversation] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const bridgeRef = useRef<ChatKitBridge | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize bridge
    bridgeRef.current = new ChatKitBridge(userId, onTodoListRefresh);

    // Load conversation history if exists
    const conversationId = getStoredConversationId();
    if (conversationId) {
      bridgeRef.current
        .loadConversationHistory(conversationId)
        .then((messages) => {
          // Initialize ChatKit with history
          // TODO: Call ChatKit initialization with messages
          setHasConversation(messages.length > 0);
          setIsLoading(false);
        })
        .catch((err) => {
          clearStoredConversationId();
          setError('Failed to load conversation history');
          setHasConversation(false);
          setIsLoading(false);
          // Auto-dismiss error after 5 seconds
          errorTimeoutRef.current = setTimeout(() => setError(null), 5000);
        });
    } else {
      // No conversation history
      setHasConversation(false);
      setIsLoading(false);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [userId, onTodoListRefresh]);

  const handleChatKitMessage = async (message: string) => {
    if (!bridgeRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await bridgeRef.current.sendMessage(message);
      setHasConversation(true);
      setLastFailedMessage(null);
      // ChatKit will handle displaying the response
      return response;
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      setLastFailedMessage(message);
      // Auto-dismiss error after 5 seconds
      errorTimeoutRef.current = setTimeout(() => setError(null), 5000);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleChatKitMessage(lastFailedMessage);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await handleChatKitMessage(messageInput);
      setMessageInput('');
    } catch (err) {
      // Error is already handled in handleChatKitMessage
    }
  };

  if (isLoading && !hasConversation) {
    return (
      <div
        className="bg-white rounded-xl shadow-lg border border-gray-100 h-[600px] flex items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label="Loading AI Assistant"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading AI Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-lg border border-gray-100 h-[600px] md:h-[600px] flex flex-col"
      role="region"
      aria-label="AI Assistant Chat Interface"
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-3 md:p-4">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">AI Assistant</h2>
        <p className="text-xs md:text-sm text-gray-600">Manage your todos with natural language</p>
      </div>

      {/* Error display with retry */}
      {error && (
        <div
          className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 m-3 md:m-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start justify-between flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <p className="text-xs md:text-sm text-red-700">{error}</p>
            </div>
            <div className="flex items-center space-x-2">
              {lastFailedMessage && (
                <button
                  onClick={handleRetry}
                  className="text-xs md:text-sm text-red-700 hover:text-red-900 font-medium underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                  aria-label="Retry sending message"
                >
                  Retry
                </button>
              )}
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                aria-label="Dismiss error message"
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasConversation && !isLoading && (
        <div className="flex-1 flex flex-col">
          <div
            className="flex-1 flex items-center justify-center p-4 md:p-8"
            role="status"
            aria-label="Empty conversation state"
          >
            <div className="text-center max-w-md">
              <div className="mx-auto h-12 w-12 md:h-16 md:w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3 md:mb-4" aria-hidden="true">
                <svg className="h-6 w-6 md:h-8 md:w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">Welcome to AI Assistant</h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
                Start a conversation to manage your todos with natural language commands.
              </p>
              <div className="text-left bg-gray-50 rounded-lg p-3 md:p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-700 mb-2">Try these examples:</p>
                <ul className="text-xs text-gray-600 space-y-1" role="list">
                  <li>• "Add a task to buy groceries"</li>
                  <li>• "Show me all my pending tasks"</li>
                  <li>• "Mark the first task as complete"</li>
                  <li>• "Delete the task about groceries"</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Message input form */}
          <div className="border-t border-gray-200 p-3 md:p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                disabled={isLoading}
                aria-label="Message input"
              />
              <button
                type="submit"
                disabled={isLoading || !messageInput.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                aria-label="Send message"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ChatKit embed container */}
      {hasConversation && (
        <div className="flex-1 overflow-hidden relative">
          {/* Loading overlay */}
          {isLoading && (
            <div
              className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
              role="status"
              aria-live="polite"
              aria-label="Sending message"
            >
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
          {/* ChatKit iframe embed */}
          <iframe
            src={`https://chatkit.openai.com/embed?key=${getChatKitDomainKey()}`}
            width="100%"
            height="100%"
            frameBorder="0"
            title="ChatKit AI Assistant Interface"
            aria-label="Chat interface for managing todos with AI"
          />
        </div>
      )}
    </div>
  );
}
