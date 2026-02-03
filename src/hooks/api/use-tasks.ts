import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { TaskPriority, TaskStatus } from "@/types";

export const useTasks = (params: {
  projectId?: string;
  assigneeId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}) => {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => taskService.getAll(params),
    // Enable only if at least projectId or assigneeId is provided to avoid fetching all tasks blindly
    enabled: !!params.projectId || !!params.assigneeId,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => taskService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", { projectId: data.projectId }] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      taskService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", { projectId: data.projectId }] });
      queryClient.invalidateQueries({ queryKey: ["task", data.id] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
