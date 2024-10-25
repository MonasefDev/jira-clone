import { client } from "@/src/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();
      if (!response.ok) {
        throw new Error("failed to get workspaces");
      }
      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
