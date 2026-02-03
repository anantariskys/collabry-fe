import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: workspaceService.getAll,
  });
};

export const useWorkspace = (id: string) => {
  return useQuery({
    queryKey: ["workspace", id],
    queryFn: () => workspaceService.getById(id),
    enabled: !!id,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workspaceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      workspaceService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workspaceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
};

export const useWorkspaceMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => workspaceService.getMembers(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useAddWorkspaceMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: { userId: string; role: "ADMIN" | "MEMBER" | "VIEWER" | "OWNER" };
    }) => workspaceService.addMember(workspaceId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
    },
  });
};

export const useRemoveWorkspaceMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      userId,
    }: {
      workspaceId: string;
      userId: string;
    }) => workspaceService.removeMember(workspaceId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      });
    },
  });
};
