import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const register = useMutation({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.auth.register.$post({
        json,
        param,
      });

      if (!res.ok) throw new Error("failed to register");

      return res.json();
    },
    onSuccess: () => {
      toast.success("you are registered!");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
    onError: () => {
      toast.error("failed to register");
    },
  });
  return register;
};
