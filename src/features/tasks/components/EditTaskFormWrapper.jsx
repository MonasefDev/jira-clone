"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTask } from "../api/use-get-task";
import { EditTaskForm } from "./EditTaskForm";

/**
 * EditTaskFormWrapper
 *
 * This component is a wrapper around the CreateTaskForm component, but it
 * loads the workspace's projects and members and passes them as options to the
 * form.
 *
 * @param {object} props - The component's props
 * @param {function} props.onCancel - The function to call when the user cancels
 * the form
 */
export const EditTaskFormWrapper = ({ taskId, onCancel }) => {
  const { workspaceId } = useParams();

  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
    taskId,
  });

  // Get the workspace's projects and members
  const { data: projects, isLoading: isLoadingProject } = useGetProjects({
    workspaceId,
  });

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  // Create options for the project and member fields based on the loaded data
  const projectOption = projects?.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOption = members?.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  // Show a loading indicator if the data is still being loaded
  const isLoading = isLoadingMembers || isLoadingProject || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex justify-center items-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) return null;

  // Render the form with the loaded data as options
  return (
    <div>
      <EditTaskForm
        onCancel={onCancel}
        projectOptions={projectOption ?? []}
        memberOptions={memberOption ?? []}
        initialValues={initialValues ?? {}}
      />
    </div>
  );
};
