"use client";
import { Loader, PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useGetTasks } from "../api/use-get-tasks";
import { DataFilters } from "./DataFilters";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DataTable } from "./DataTable";
import { columns } from "./column";
import DataKanban from "./DataKanban";
import { useBulkUpdateTask } from "../api/use-bulk-update-task";
import { useCallback } from "react";
import { DataCalendar } from "./DataCalendar";

export const TaskViewSwitcher = () => {
  const [{ status, assigneeId, projectId, dueDate, search }] = useTaskFilters();

  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const { workspaceId } = useParams();
  const { mutate: bulkUpdate, isLoading: isBulkUpdating } = useBulkUpdateTask();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId,
    dueDate,
    search,
  });
  const { open } = useCreateTaskModal();

  const onKanbanChange = useCallback(
    (tasks) => {
      bulkUpdate({
        json: { tasks },
      });
      console.log(tasks);
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg "
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-6 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban data={tasks ?? []} onChange={onKanbanChange} />
            </TabsContent>
            <TabsContent value="calender" className="mt-0  h-full pb-4">
              <DataCalendar data={tasks ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
