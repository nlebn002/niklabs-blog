import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiAuthMe, postApiAuthLogin, postApiAuthLogout } from "../../../generated-openapi/auth/auth";
import { LoginRequest } from "../../../generated-openapi/models";


export const authKeys = {
  currentUser: ["auth", "current-user"] as const
};

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: async () => {
      const response = await getApiAuthMe();

      if (response.status === 401) {
        return null;
      }

      return response.data;
    },
    retry: false
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await postApiAuthLogin(payload);

      if (response.status === 401) {
        throw new Error(response.data.message);
      }

      return response.data;
    },
    onSuccess: async (user) => {
      queryClient.setQueryData(authKeys.currentUser, user);
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await postApiAuthLogout();
    },
    onSettled: async () => {
      queryClient.setQueryData(authKeys.currentUser, null);
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser });
    }
  });
}
