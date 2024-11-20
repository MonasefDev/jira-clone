"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { ErrorPage } from "@/components/ErrorPage";
import { LoaderPage } from "@/components/LoaderPage";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { TaskBreadcrumbs } from "@/features/tasks/components/TaskBreadcrumbs";
import { TaskDescription } from "@/features/tasks/components/TaskDescription";
import { TaskOverview } from "@/features/tasks/components/TaskOverview";
import { useParams } from "next/navigation";

const TaskIdPage = () => {
  const { taskId } = useParams();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <LoaderPage />;
  }

  if (!data) {
    return <ErrorPage message="Task not found" />;
  }
  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <DottedSeparator className="my-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
};

export default TaskIdPage;
