import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useBulkUpdateTask = () => {
  const router = useRouter();
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
      router.refresh();
      // toast.success("Tasks updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["project-analytics", data.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-analytics", data.workspaceId],
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
};
