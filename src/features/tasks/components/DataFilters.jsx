import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";

import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Folder, ListCheckIcon, UserIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useTaskFilters } from "../hooks/use-task-filters";
import { TaskStatus } from "../types";
import { useEffect } from "react";

export const DataFilters = ({ hideProjectFilter }) => {
  const { workspaceId, projectId: selectedProjectId } = useParams();

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.map((project) => ({
    value: project.$id,
    label: project.name,
  }));
  const memberOptions = members?.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ status, assigneeId, projectId, dueDate, search }, setFilters] =
    useTaskFilters();

  useEffect(() => {
    if (hideProjectFilter) {
      setFilters({ projectId: selectedProjectId });
    }
  }, [selectedProjectId]);

  const onStatusChange = (value) => {
    if (value === "all") {
      setFilters({ status: null });
    } else setFilters({ status: value });
  };

  const onAssigneeChange = (value) => {
    if (value === "all") {
      setFilters({ assigneeId: null });
    } else setFilters({ assigneeId: value });
  };
  const onProjectChange = (value) => {
    if (value === "all") {
      setFilters({ projectId: null });
    } else setFilters({ projectId: value });
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}
        >
          <SelectTrigger className="w-full lg:w-auto h-8">
            <div className="flex items-center pr-2">
              <Folder className="size-4 mr-2" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};
