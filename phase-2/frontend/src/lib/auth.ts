// Mock Better Auth implementation for now
// In a real implementation, this would use the actual Better Auth library

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const authState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const mockAuth = {
  signIn: async (email: string, password: string) => {
    // In a real implementation, this would call the actual Better Auth API
    console.log('Sign in attempt with:', email);

    // Mock response
    const user: User = {
      id: 'mock-user-id',
      email,
      name: 'Mock User',
    };

    authState.user = user;
    authState.isAuthenticated = true;
    authState.isLoading = false;

    return { user, error: null };
  },

  signUp: async (email: string, password: string, name: string) => {
    // In a real implementation, this would call the actual Better Auth API
    console.log('Sign up attempt with:', email);

    // Mock response
    const user: User = {
      id: 'mock-user-id',
      email,
      name,
    };

    authState.user = user;
    authState.isAuthenticated = true;
    authState.isLoading = false;

    return { user, error: null };
  },

  signOut: async () => {
    // In a real implementation, this would call the actual Better Auth API
    console.log('Sign out attempt');

    authState.user = null;
    authState.isAuthenticated = false;
    authState.isLoading = false;

    return { error: null };
  },

  getUser: () => {
    return authState.user;
  },

  isAuthenticated: () => {
    return authState.isAuthenticated;
  },

  getCurrentUser: () => {
    return authState.user;
  },
};

// Export the actual Better Auth library when we integrate it
// export { auth } from "better-auth";
// export type { Session, User } from "better-auth";