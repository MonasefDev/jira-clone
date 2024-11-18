"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/useConfirm";

import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import React from "react";
import { useDeleteTask } from "../api/use-delete-task";
import { useParams, useRouter } from "next/navigation";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";

export const TaskActions = ({ id, projectId, children }) => {
  const router = useRouter();
  const { workspaceId } = useParams();
  const { mutate: deleteTask, isLoading: isDeleting } = useDeleteTask();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Task",
    "Are you sure you want to delete this task?",
    "destructive"
  );

  const onTaskOpen = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  const onProjectOpen = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
  };

  const onDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;
    deleteTask({ param: { taskId: id } });
  };

  const { open } = useEditTaskModal();

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DeleteDialog />
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onTaskOpen} className="font-medium p-3">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onProjectOpen} className="font-medium p-3">
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-3"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onDelete}
            disabled={false}
            className="text-amber-700 focus:text-amber-700 font-medium p-3"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
