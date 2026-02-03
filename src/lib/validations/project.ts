import * as z from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters" }),
  description: z.string().optional(),
  workspaceId: z.string().uuid(),
});

export type CreateProjectValues = z.infer<typeof createProjectSchema>;
