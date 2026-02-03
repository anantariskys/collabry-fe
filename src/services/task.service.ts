import api from "@/lib/axios";
import { ApiResponse, Task, TaskPriority, TaskStatus } from "@/types";

export const taskService = {
  getAll: async (params: { projectId?: string; assigneeId?: string; status?: TaskStatus; priority?: TaskPriority }) => {
    const response = await api.get<ApiResponse<Task[]>>("/tasks", { params });
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  create: async (data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate?: string;
    projectId: string;
    assigneeId?: string;
  }) => {
    const response = await api.post<ApiResponse<Task>>("/tasks", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Task>) => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};
