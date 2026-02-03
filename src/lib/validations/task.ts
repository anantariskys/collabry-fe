import * as z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  projectId: z.string().uuid(),
  assigneeId: z.string().uuid().optional().or(z.literal("")),
});

export type CreateTaskValues = z.infer<typeof createTaskSchema>;
