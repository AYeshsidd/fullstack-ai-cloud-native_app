// phase-3/frontend/src/lib/chatkit-config.ts

export interface ChatKitConfig {
  domainKey: string;
  backendEndpoint: string;
  authToken: string;
  conversationId?: string;
  onMessage?: (message: string) => Promise<void>;
  onResponse?: (response: any) => void;
  onError?: (error: any) => void;
}

export interface BackendMessage {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string;
}

export interface ChatKitMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  tool_calls: ToolCall[];
  messages: BackendMessage[];
}

export interface ToolCall {
  name: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  status: 'success' | 'error';
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: BackendMessage[];
}

export interface ChatKitBridgeState {
  conversationId: string | null;
  userId: string;
  isInitialized: boolean;
  lastError: string | null;
}

// Utility functions
const CONVERSATION_ID_KEY = 'chatkit-conversation-id';

export function getStoredConversationId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONVERSATION_ID_KEY);
}

export function setStoredConversationId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONVERSATION_ID_KEY, id);
}

export function clearStoredConversationId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONVERSATION_ID_KEY);
}

export function translateBackendMessageToChatKit(backendMsg: BackendMessage): ChatKitMessage {
  return {
    id: `${backendMsg.timestamp}-${backendMsg.role}`,
    role: backendMsg.role === 'tool' ? 'assistant' : backendMsg.role,
    content: backendMsg.content,
    timestamp: backendMsg.timestamp,
  };
}

export function getChatKitDomainKey(): string {
  return process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_KEY || '';
}

export function getChatKitBackendUrl(): string {
  return process.env.NEXT_PUBLIC_CHATKIT_BACKEND_URL || 'http://localhost:8000/api/v1';
}
