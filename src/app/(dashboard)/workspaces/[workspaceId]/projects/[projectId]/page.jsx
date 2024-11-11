import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

import { getCurrentUser } from "@/features/auth/queries";
import { getProject } from "@/features/projects/queries";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";

// import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

const ProjectIdPage = async ({ params }) => {
  const user = await getCurrentUser();
  const initialValues = await getProject({
    projectId: params.projectId,
  });

  if (!user) redirect("/sign-in");
  if (!initialValues) {
    throw new Error("Project not found");
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
      {/* <TaskViewSwitcher /> */}
    </div>
  );
};

export default ProjectIdPage;

// export async function generateMetadata({
//   params,
// }: ProjectIdPageProps): Promise<{ title: string, description: string }> {
//   const { projectId } = params;
//   return {
//     title: `Project ${projectId}`,
//     description: `Details and information about project ${projectId}.`,
//   };
// }
