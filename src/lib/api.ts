const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Helper function for API calls
export async function apiCall<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || `API error: ${response.statusText}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await apiCall<{
      token: string;
      user: { id: string; username: string; role: string };
    }>("/auth/login", "POST", { username, password });
    return response;
  },

  getCurrentUser: async (token: string) => {
    return apiCall("/auth/me", "GET", undefined, token);
  },
};

// Users API
export const usersAPI = {
  getAll: async (token: string) => {
    return apiCall("/users", "GET", undefined, token);
  },

  create: async (username: string, password: string, token: string) => {
    return apiCall("/users", "POST", { username, password }, token);
  },

  delete: async (userId: string, token: string) => {
    return apiCall(`/users/${userId}`, "DELETE", undefined, token);
  },

  updatePassword: async (
    userId: string,
    oldPassword: string,
    newPassword: string,
    token: string,
  ) => {
    return apiCall(
      `/users/${userId}/password`,
      "PUT",
      { oldPassword, newPassword },
      token,
    );
  },
};

// Tasks API
export const tasksAPI = {
  getAll: async (token: string) => {
    return apiCall("/tasks", "GET", undefined, token);
  },

  create: async (designation: string, token: string) => {
    return apiCall("/tasks", "POST", { designation }, token);
  },

  delete: async (taskId: string, token: string) => {
    return apiCall(`/tasks/${taskId}`, "DELETE", undefined, token);
  },
};

// User Tasks API
export const userTasksAPI = {
  getMyTasks: async (token: string) => {
    return apiCall("/user-tasks", "GET", undefined, token);
  },

  getAllTasks: async (token: string) => {
    return apiCall("/user-tasks/admin/all", "GET", undefined, token);
  },

  assign: async (userId: string, taskId: string, token: string) => {
    return apiCall("/user-tasks", "POST", { userId, taskId }, token);
  },

  update: async (
    userTaskId: string,
    status?: string,
    startDate?: string,
    endDate?: string,
    notes?: string,
    token?: string,
  ) => {
    return apiCall(
      `/user-tasks/${userTaskId}`,
      "PUT",
      {
        ...(status && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(notes && { notes }),
      },
      token,
    );
  },

  remove: async (userTaskId: string, token: string) => {
    return apiCall(`/user-tasks/${userTaskId}`, "DELETE", undefined, token);
  },
};
