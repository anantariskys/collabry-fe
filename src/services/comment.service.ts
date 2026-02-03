import api from "@/lib/axios";
import { ApiResponse, Comment } from "@/types";

export const commentService = {
  getAll: async (taskId: string) => {
    const response = await api.get<ApiResponse<Comment[]>>("/comments", {
      params: { taskId },
    });
    return response.data.data;
  },

  create: async (data: { content: string; taskId: string }) => {
    const response = await api.post<ApiResponse<Comment>>("/comments", data);
    return response.data.data;
  },
};
