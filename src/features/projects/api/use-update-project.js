import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useUpdateProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[":projectId"].$patch({
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
      toast.success("Project updated successfully");
      // router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["projects", data?.workspaceId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", data?.$id] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return mutation;
};
