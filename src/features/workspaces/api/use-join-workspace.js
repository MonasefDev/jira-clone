import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "join"
      ].$post({
        param,
        json,
      });

      const resJson = await response.json();
      if (!resJson.success) {
        const { message } = resJson;
        throw new Error(message);
      }
      const { data } = resJson;
      return data;
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace joined successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
};
