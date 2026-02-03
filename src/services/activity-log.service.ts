import api from "@/lib/axios";
import { ActivityLog, ApiResponse, PaginatedResponse } from "@/types";

export const activityLogService = {
  getLogs: async (params?: {
    workspaceId?: string;
    userId?: string;
    entityType?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ActivityLog>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<ActivityLog>>>("/activity-logs", { params });
    return response.data.data;
  },
};
