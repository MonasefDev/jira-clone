import { client } from "../../../lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[":memberId"].$patch({
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
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutation;
};
