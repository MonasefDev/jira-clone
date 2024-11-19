import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useBulkUpdateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["bulk-update"].$post({
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

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
};
