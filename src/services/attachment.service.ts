import api from "@/lib/axios";
import { ApiResponse, Attachment } from "@/types";

export const attachmentService = {
  getAll: async (taskId: string) => {
    const response = await api.get<ApiResponse<Attachment[]>>("/attachments", {
      params: { taskId },
    });
    return response.data.data;
  },

  create: async (data: {
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    taskId: string;
  }) => {
    const response = await api.post<ApiResponse<Attachment>>("/attachments", data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await api.delete(`/attachments/${id}`);
  },
};
