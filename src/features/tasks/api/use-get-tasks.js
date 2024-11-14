import { client } from "../../../lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetTasks = ({
  workspaceId,
  projectId,
  assigneeId,
  status,
  dueDate,
  search,
}) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      assigneeId,
      status,
      dueDate,
      search,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          assigneeId: assigneeId ?? undefined,
          status: status ?? undefined,
          dueDate: dueDate ?? undefined,
          search: search ?? undefined,
        },
      });
      const resJson = await response.json();
      if (!resJson.success) {
        throw new Error("failed to get tasks");
      }
      const { data } = resJson;
      return data;
    },
  });

  return query;
};
