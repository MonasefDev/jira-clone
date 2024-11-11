import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }), // Name validation
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: "must be at least 1 character" })
    .optional(), // Name validation
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
