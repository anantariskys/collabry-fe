import api from "@/lib/axios";
import { ApiResponse, Project } from "@/types";

export const projectService = {
  getAll: async (workspaceId: string) => {
    const response = await api.get<ApiResponse<Project[]>>("/projects", {
      params: { workspaceId },
    });
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return response.data.data;
  },

  create: async (data: { name: string; description?: string; workspaceId: string }) => {
    const response = await api.post<ApiResponse<Project>>("/projects", data);
    return response.data.data;
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    const response = await api.patch<ApiResponse<Project>>(`/projects/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/projects/${id}`);
  },
};
