"use client";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";

import { Analytics } from "@/components/Analytics";
import { ErrorPage } from "@/components/ErrorPage";
import { LoaderPage } from "@/components/LoaderPage";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { TaskViewSwitcher } from "@/features/tasks/components/TasksViewSwitcher";
import { useParams } from "next/navigation";

// import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

const ProjectIdPage = () => {
  const { projectId } = useParams();
  const { data: initialValues, isPending: isLoadingProject } = useGetProject({
    projectId,
  });
  const { data: anaylics, isPending: isLoadingAnalytics } =
    useGetProjectAnalytics({
      projectId,
    });

  if (isLoadingProject || isLoadingAnalytics) {
    return <LoaderPage />;
  }

  if (!initialValues) {
    return <ErrorPage message="Project not found" />;
  }
  if (!anaylics) {
    return <ErrorPage message="Project Analytics not found" />;
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            image={initialValues?.imageUrl}
            name={initialValues?.name}
          />
          <p className="text-lg font-semibold">{initialValues?.name}</p>
        </div>
        <div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}
            >
              <Pencil1Icon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      {anaylics ? <Analytics data={anaylics} /> : null}
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

export default ProjectIdPage;
