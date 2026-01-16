// API Client for connecting to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// User interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

// Todo interfaces
export interface TodoTask {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  completed?: boolean;
}

// API service class
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Authentication methods
  async register(userData: RegisterData): Promise<ApiResponse<{ user: User; access_token: string; token_type: string }>> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        error: errorData || `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; access_token: string; token_type: string }>> {
    const response = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        error: errorData || `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  }

  async logout(): Promise<ApiResponse<any>> {
    // Get token from localStorage or wherever it's stored
    const token = localStorage.getItem('access_token');

    const response = await fetch(`${this.baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        error: errorData || `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    // For logout, the response may not have a body
    return {
      success: true,
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const token = localStorage.getItem('access_token');

    const response = await fetch(`${this.baseUrl}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        error: errorData || `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  }

  // Todo methods
  async getTodos(userId: string, completed?: boolean): Promise<ApiResponse<TodoTask[]>> {
    const token = localStorage.getItem('access_token');
    let url = `${this.baseUrl}/api/v1/users/${userId}/tasks`;

    if (completed !== undefined) {
      url += `?completed=${completed}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        error: errorData || `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  }

  async createTodo(userId: string, todoData: CreateTodoData): Promise<ApiResponse<TodoTask>> {
    const token = localStorage.getItem('access_token');

    // Ensure we're sending proper JSON
    const response = await fetch(`${this.baseUrl}/api/v1/users/${userId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        error: errorData || `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  }

  async updateTodo(userId: string, taskId: string, todoData: UpdateTodoData): Promise<ApiResponse<TodoTask>> {
    const token = localStorage.getItem('access_token');

    // Ensure we're sending proper JSON
    const response = await fetch(`${this.baseUrl}/api/v1/users/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        error: errorData || `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  }

  async deleteTodo(userId: string, taskId: string): Promise<ApiResponse<any>> {
    const token = localStorage.getItem('access_token');

    const response = await fetch(`${this.baseUrl}/api/v1/users/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        error: errorData || `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    // For delete, the response may not have a body
    return {
      success: true,
    };
  }

  async updateTodoCompletion(userId: string, taskId: string, completed: boolean): Promise<ApiResponse<TodoTask>> {
    const token = localStorage.getItem('access_token');

    // Ensure we're sending proper JSON
    const response = await fetch(`${this.baseUrl}/api/v1/users/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        error: errorData || `HTTP error! status: ${response.status}`,
        success: false,
      };
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  }
}

export const apiClient = new ApiService();