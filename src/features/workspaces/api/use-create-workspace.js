import { client } from "@/src/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const workspace = useMutation({
    mutationFn: async ({ form, param }) => {
      const res = await client.api.workspaces.create.$post({
        form,
        param,
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });
  return workspace;
};
