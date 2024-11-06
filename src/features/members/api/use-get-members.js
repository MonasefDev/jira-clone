import { client } from "../../../lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetMembers = ({ workspaceId }) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      console.log("passed");
      const response = await client.api.members.$get({
        query: { workspaceId },
      });
      const resJson = await response.json();
      console.log("from tanstack _: ", resJson);
      if (!resJson.success) {
        throw new Error("failed to get members");
      }
      const { data } = resJson;
      return data;
    },
  });

  return query;
};
