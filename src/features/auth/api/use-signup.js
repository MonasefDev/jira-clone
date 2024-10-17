import { client } from "@/src/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const register = useMutation({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.auth.register.$post({
        json,
        param,
      });

      return res.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
  return register;
};
