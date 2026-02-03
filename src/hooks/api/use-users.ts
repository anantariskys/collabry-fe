import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { User } from "@/types";

export const useUsers = (params?: { page?: number; limit?: number; search?: string }) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getUsers(params),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: () => userService.getMe(),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });
};
