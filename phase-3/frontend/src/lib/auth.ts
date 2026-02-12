import { apiClient, User } from './api-client';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initialize auth state from localStorage if available
const getInitialAuthState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    // Note: We can't decode the JWT to get user info without a library
    // So we just set isAuthenticated based on token presence
    return {
      user: null, // We don't know the user until we call an API
      isAuthenticated: !!token,
      isLoading: false,
    };
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };
};

export const authState: AuthState = getInitialAuthState();

export const mockAuth = {
  signIn: async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });

      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('access_token', response.data.access_token);

        // Update auth state
        authState.user = response.data.user;
        authState.isAuthenticated = true;

        return { user: response.data.user, error: null };
      } else {
        return { user: null, error: response.error || 'Login failed' };
      }
    } catch (error: any) {
      return { user: null, error: error.message || 'Login failed' };
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      const response = await apiClient.register({ email, password, name });

      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('access_token', response.data.access_token);

        // Update auth state
        authState.user = response.data.user;
        authState.isAuthenticated = true;

        return { user: response.data.user, error: null };
      } else {
        return { user: null, error: response.error || 'Registration failed' };
      }
    } catch (error: any) {
      return { user: null, error: error.message || 'Registration failed' };
    }
  },

  signOut: async () => {
    try {
      // Call logout endpoint
      await apiClient.logout();

      // Clear token from localStorage
      localStorage.removeItem('access_token');

      // Update auth state
      authState.user = null;
      authState.isAuthenticated = false;

      return { error: null };
    } catch (error: any) {
      // Even if logout API fails, still clear local state
      localStorage.removeItem('access_token');
      authState.user = null;
      authState.isAuthenticated = false;

      return { error: error.message || 'Logout failed' };
    }
  },

  getUser: () => {
    return authState.user;
  },

  isAuthenticated: () => {
    // Check both state and token existence
    if (authState.isAuthenticated) return true;

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      return !!token;
    }

    return authState.isAuthenticated;
  },

  getCurrentUser: () => {
    return authState.user;
  },

  // Method to refresh user data from the API
  refreshUser: async () => {
    try {
      const response = await apiClient.getCurrentUser();

      if (response.success && response.data) {
        authState.user = response.data;
        authState.isAuthenticated = true;
        return response.data;
      } else {
        // If API call fails, check if token exists and set isAuthenticated accordingly
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          authState.isAuthenticated = !!token;
        }
        return null;
      }
    } catch (error) {
      // If API call fails, check if token exists and set isAuthenticated accordingly
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        authState.isAuthenticated = !!token;
      }
      return null;
    }
  },
};