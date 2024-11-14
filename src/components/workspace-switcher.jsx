"use client";
import React, { useCallback } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { useParams, useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { useGetWorkspaces } from "../features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "../features/workspaces/components/workspace-avatar";
import { useCreateWorkspaceModal } from "../features/workspaces/hooks/use-create-workspace-modal";

export const WorkspaceSwitcher = () => {
  const { data: workspaces, isPending: isLoading } = useGetWorkspaces();
  const { workspaceId } = useParams();
  const { open } = useCreateWorkspaceModal();
  const router = useRouter();

  const onSelect = useCallback(
    (workspaceId) => {
      router.push(`/workspaces/${workspaceId}`);
    },
    [router]
  );

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500 uppercase">
          workspace
        </p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select
        defaultValue={workspaceId}
        value={workspaceId}
        onValueChange={onSelect}
      >
        <SelectTrigger className="w-full bg-neutral-200 font-medium py-1 px-2 ">
          <SelectValue
            placeholder="No workspace selected"
            className="text-neutral-500"
          />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.length === 0 ? (
            <div className="text-neutral-500 py-1 px-2">
              No workspaces found
            </div>
          ) : (
            workspaces?.map((workspace) => (
              <SelectItem key={workspace.$id} value={workspace.$id}>
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.imageUrl}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
