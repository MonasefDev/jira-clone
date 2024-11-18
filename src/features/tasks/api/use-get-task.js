import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetTask = ({ taskId }) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: {
          taskId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get tasks");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
