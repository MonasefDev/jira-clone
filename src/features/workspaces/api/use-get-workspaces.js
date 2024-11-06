import { client } from "../../../lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();
      const resJson = await response.json();
      if (!resJson.success) {
        throw new Error("failed to get workspaces");
      }
      const { data } = resJson;
      return data;
    },
  });

  return query;
};
