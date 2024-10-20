import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/src/lib/rpc";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useLogout = () => {
  //! to pass data and params to the mutate function use mutate({ json: formData, param: { userId: "123" } })
  const queryClient = useQueryClient();
  const router = useRouter();
  const logout = useMutation({
    mutationFn: async () => {
      const res = await client.api.auth.logout.$post();

      if (!res.ok) throw new Error("failed to logout");

      return res.json();
    },
    onSuccess: () => {
      toast.success("you are logged out");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: () => {
      toast.error("failed to logout");
    },
  });
  return logout;
};
