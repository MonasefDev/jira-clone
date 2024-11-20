import { client } from "../../../lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceAnalytics = ({ workspaceId }) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[
        ":workspaceId"
      ].analytics.$get({
        param: { workspaceId },
      });
      const resJson = await response.json();
      if (!resJson.success) {
        throw new Error("failed to get workspace analytics");
      }
      const { data } = resJson;
      return data;
    },
  });

  return query;
};
