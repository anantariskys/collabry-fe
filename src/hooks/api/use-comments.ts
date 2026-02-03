import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentService } from "@/services/comment.service";

export const useComments = (taskId: string) => {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => commentService.getAll(taskId),
    enabled: !!taskId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments", data.taskId] });
    },
  });
};
