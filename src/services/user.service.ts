import api from "@/lib/axios";
import { User, ApiResponse, PaginatedResponse } from "@/types";

export const userService = {
  getMe: async (): Promise<User> => {
    // Ideally the backend supports /users/me
    const response = await api.get<ApiResponse<User>>("/users/me");
    return response.data.data;
  },

  getUsers: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<User>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>("/users", { params });
    return response.data.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },
};
