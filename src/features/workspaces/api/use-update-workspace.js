import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const workspace = useMutation({
    mutationFn: async ({ form, param }) => {
      const res = await client.api.workspaces[":workspaceId"].$patch({
        form,
        param,
      });

      if (!res.success) {
        const { message } = await res.json();
        throw new Error(message);
      }
      return res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return workspace;
};
