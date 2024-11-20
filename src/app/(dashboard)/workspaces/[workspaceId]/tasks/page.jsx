import { TaskViewSwitcher } from "@/features/tasks/components/TasksViewSwitcher";

export default function TasksPage() {
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
}
