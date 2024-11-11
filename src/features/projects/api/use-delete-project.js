import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { client } from "../../../lib/rpc";

export const useDeleteProject = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ param }) => {
      const response = await client.api.projects[":projectId"].$delete({
        param,
      });

      const resJson = await response.json();

      if (!resJson.success) {
        const { message } = resJson;
        throw new Error(message);
      }
      return resJson.data;
    },
    onSuccess: (data) => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["projects", data?.workspaceId],
      });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutation;
};
