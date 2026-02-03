import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";

export const useProjects = (workspaceId: string) => {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => projectService.getAll(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects", data.workspaceId] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; description?: string };
    }) => projectService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects", data.workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => {
      // Note: We might need to invalidate specific workspace projects if we knew the workspaceId here
      // Ideally the delete response or context should provide it, or we invalidate all projects
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
