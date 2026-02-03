import { useQuery } from "@tanstack/react-query";
import { activityLogService } from "@/services/activity-log.service";

export const useActivityLogs = (params?: {
  workspaceId?: string;
  userId?: string;
  entityType?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => activityLogService.getLogs(params),
  });
};
