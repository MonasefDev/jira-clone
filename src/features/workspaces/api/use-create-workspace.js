import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const workspace = useMutation({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces.create.$post({
        form,
        param,
      });

      const resJson = await response.json();

      if (!resJson.success) {
        const { message } = await response.json();
        throw new Error(message);
      }
      const { data } = resJson;
      return data;
    },

    onSuccess: ({ data, message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return workspace;
};
