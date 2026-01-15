import { authState } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Interface for API response
 */
interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

/**
 * Centralized API client that automatically injects JWT tokens
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the current authentication token
   */
  private getToken(): string | null {
    // In a real implementation, this would get the token from Better Auth
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token');
    }
    return null;
  }

  /**
   * Prepare headers with authentication token
   */
  private getHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...additionalHeaders,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);

      if (params) {
        Object.keys(params).forEach(key => {
          url.searchParams.append(key, params[key]);
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
      }

      return { data, success: true };
    } catch (error) {
      return { error: (error as Error).message, success: false };
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
      }

      return { data, success: true };
    } catch (error) {
      return { error: (error as Error).message, success: false };
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
      }

      return { data, success: true };
    } catch (error) {
      return { error: (error as Error).message, success: false };
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Request failed');
      }

      // DELETE requests typically don't return body content
      return { success: true };
    } catch (error) {
      return { error: (error as Error).message, success: false };
    }
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
      }

      return { data, success: true };
    } catch (error) {
      return { error: (error as Error).message, success: false };
    }
  }
}

// Create a singleton instance of the API client
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const { get, post, put, patch } = apiClient;