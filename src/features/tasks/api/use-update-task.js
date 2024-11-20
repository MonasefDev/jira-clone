import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useUpdateTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.tasks[":taskId"].$patch({
        form,
        param,
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
      toast.success("Task updated successfully");
      router.refresh();
      router.push(`/workspaces/${data?.workspaceId}/tasks/${data?.$id}`);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
};
