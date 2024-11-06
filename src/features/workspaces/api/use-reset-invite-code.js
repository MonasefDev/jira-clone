import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();
  const workspace = useMutation({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "reset-invite-code"
      ].$post({
        param,
      });

      const resJson = await response.json();
      if (!resJson.success) {
        const { message } = await res.json();
        throw new Error(message);
      }
      return resJson.data;
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return workspace;
};
