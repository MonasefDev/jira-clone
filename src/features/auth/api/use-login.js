import { client } from "@/src/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const login = useMutation({
    //! to pass data and params to the mutate function use mutate({ json: formData, param: { userId: "123" } })
    mutationFn: async ({ json, param }) => {
      const res = await client.api.auth.login.$post({
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
  return login;
};
