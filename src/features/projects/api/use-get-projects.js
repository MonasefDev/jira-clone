import { client } from "../../../lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetProjects = ({ workspaceId }) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId },
      });
      const resJson = await response.json();
      if (!resJson.success) {
        throw new Error("failed to get projects");
      }
      const { data } = resJson;
      return data;
    },
  });

  return query;
};
