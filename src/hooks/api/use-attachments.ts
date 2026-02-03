import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attachmentService } from "@/services/attachment.service";

export const useAttachments = (taskId: string) => {
  return useQuery({
    queryKey: ["attachments", taskId],
    queryFn: () => attachmentService.getAll(taskId),
    enabled: !!taskId,
  });
};

export const useCreateAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attachmentService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attachments", data.taskId] });
    },
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attachmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
};
