import * as z from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(3, { message: "Workspace name must be at least 3 characters" }),
});

export type CreateWorkspaceValues = z.infer<typeof createWorkspaceSchema>;

export const addMemberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});

export type AddMemberValues = z.infer<typeof addMemberSchema>;
