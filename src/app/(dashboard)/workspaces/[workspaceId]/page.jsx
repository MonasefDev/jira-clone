"use client";

import { useParams } from "next/navigation";

import { ErrorPage } from "@/components/ErrorPage";
import { LoaderPage } from "@/components/LoaderPage";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { Analytics } from "@/components/Analytics";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { Button } from "@/components/ui/button";
import { Calendar, PlusIcon, Settings } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectAvatar } from "@/features/projects/components/ProjectAvatar";
import { formatDistanceToNow } from "date-fns";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { MemberAvatar } from "@/features/members/components/MeberAvatar";
import { TaskList } from "@/components/TaskList";
import { ProjectList } from "@/components/ProjectList";

const WorkspaceIdPage = () => {
  const { workspaceId } = useParams();
  const { data: analytics, isPending: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: projects, isFetching: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: tasks, isFetching: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: members, isFetching: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingProjects ||
    isLoadingTasks ||
    isLoadingMembers;

  if (isLoading) return <LoaderPage />;

  if (!analytics || !projects || !tasks || !members) {
    return <ErrorPage message="Failed to load workspace data" />;
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks} total={tasks.length} />
        <ProjectList data={projects} total={projects.length} />
        <MemberList data={members} total={members.length} />
      </div>
    </div>
  );
};

export default WorkspaceIdPage;

export const MemberList = ({ data, total }) => {
  const { workspaceId } = useParams();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button variant="secondary" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <Settings className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2  gap-4">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar
                    name={member.name}
                    className="size-10"
                    fallbackClassName="text-md"
                  />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
};
