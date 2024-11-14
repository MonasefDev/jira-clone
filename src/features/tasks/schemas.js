import { z } from "zod";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.enum(["BACKLOG", "TODO", "IN_REVIEW", "IN_PROGRESS", "DONE"], {
    required_error: "Required",
  }),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "Required"),
  description: z.string().trim().optional(),
});
