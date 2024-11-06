import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"].$delete({
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
    onSuccess: ({ data }) => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutation;
};
