import api from "@/lib/axios";
import { ApiResponse, Workspace, WorkspaceMember } from "@/types";

export const workspaceService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Workspace[]>>("/workspaces");
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Workspace>>(`/workspaces/${id}`);
    return response.data.data;
  },

  create: async (data: { name: string }) => {
    const response = await api.post<ApiResponse<Workspace>>("/workspaces", data);
    return response.data.data;
  },

  update: async (id: string, data: { name: string }) => {
    const response = await api.patch<ApiResponse<Workspace>>(`/workspaces/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/workspaces/${id}`);
  },

  getMembers: async (workspaceId: string) => {
    const response = await api.get<ApiResponse<WorkspaceMember[]>>(`/workspaces/${workspaceId}/members`);
    return response.data.data;
  },

  addMember: async (workspaceId: string, data: { userId: string; role: "ADMIN" | "MEMBER" | "VIEWER" | "OWNER" }) => {
    const response = await api.post<ApiResponse<WorkspaceMember>>(`/workspaces/${workspaceId}/members`, data);
    return response.data.data;
  },

  removeMember: async (workspaceId: string, userId: string) => {
    await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
  },
};
