import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/src/lib/rpc";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  //! to pass data and params to the mutate function use mutate({ json: formData, param: { userId: "123" } })
  const queryClient = useQueryClient();
  const router = useRouter();
  const logout = useMutation({
    mutationFn: async () => {
      const res = await client.api.auth.logout.$post();
      return res.json();
    },
    onSuccess: () => {
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
  return logout;
};
