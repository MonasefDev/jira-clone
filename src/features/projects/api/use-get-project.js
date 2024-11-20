import { client } from "../../../lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetProject = ({ projectId }) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].$get({
        param: { projectId },
      });
      const resJson = await response.json();
      if (!resJson.success) {
        throw new Error("failed to get project");
      }
      const { data } = resJson;
      return data;
    },
  });

  return query;
};
