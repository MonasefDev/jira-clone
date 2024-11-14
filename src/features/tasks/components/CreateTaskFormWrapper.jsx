"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { CreateTaskForm } from "./CreateTaskForm";

export const CreateTaskFormWrapper = ({ onCancel }) => {
  const { workspaceId } = useParams();
  const { data: projects, isLoading: isLoadingProject } = useGetProjects({
    workspaceId,
  });

  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const projectOption = projects?.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));

  const memberOption = members?.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isLoading = isLoadingMembers || isLoadingProject;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex justify-center items-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <CreateTaskForm
        onCancel={onCancel}
        projectOptions={projectOption ?? []}
        memberOptions={memberOption ?? []}
      />
    </div>
  );
};
