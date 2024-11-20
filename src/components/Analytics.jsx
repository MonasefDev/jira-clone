"use client";

import { AnalyticsCard } from "./AnalyticsCard";
import { DottedSeparator } from "./dotted-separator";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export const Analytics = ({ data }) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1 ">
          <AnalyticsCard
            title="Total Tasks"
            value={data.taskCount}
            varient={data.taskDifference > 0 ? "up" : "down"}
            increaseValue={data.taskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1 ">
          <AnalyticsCard
            title="Total Assigned"
            value={data.assignedTasksCount}
            varient={data.assignedTasksDifference > 0 ? "up" : "down"}
            increaseValue={data.assignedTasksDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1 ">
          <AnalyticsCard
            title="Total Completed"
            value={data.completedTaskCount}
            varient={data.completedTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.completedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex items-center flex-1 ">
          <AnalyticsCard
            title="Total Overdue"
            value={data.overdueTaskCount}
            varient={data.overdueTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.overdueTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1 ">
          <AnalyticsCard
            title="Total Incomplete"
            value={data.incompleteTaskCount}
            varient={data.incompleteTaskDifference > 0 ? "up" : "down"}
            increaseValue={data.incompleteTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
