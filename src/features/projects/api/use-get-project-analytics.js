import { client } from "../../../lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetProjectAnalytics = ({ projectId }) => {
  console.log("project-analytics", projectId);

  const query = useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].analytics.$get({
        param: { projectId },
      });
      const resJson = await response.json();
      if (!resJson.success) {
        throw new Error("failed to get analytics");
      }
      const { data } = resJson;
      return data;
    },
  });

  return query;
};
