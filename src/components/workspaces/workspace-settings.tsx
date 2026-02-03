import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateWorkspace, useDeleteWorkspace } from "@/hooks/api/use-workspaces";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type UpdateWorkspaceFormValues = z.infer<typeof updateWorkspaceSchema>;

interface WorkspaceSettingsProps {
  workspace: {
    id: string;
    name: string;
    ownerId: string;
  };
  currentUserId: string;
}

export function WorkspaceSettings({ workspace, currentUserId }: WorkspaceSettingsProps) {
  const router = useRouter();
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();

  const isOwner = workspace.ownerId === currentUserId;

  const form = useForm<UpdateWorkspaceFormValues>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
    },
  });

  const onSubmit = (data: UpdateWorkspaceFormValues) => {
    updateWorkspace.mutate(
      { id: workspace.id, data },
      {
        onSuccess: () => {
          toast.success("Workspace updated successfully");
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
      deleteWorkspace.mutate(workspace.id, {
        onSuccess: () => {
          router.push("/dashboard");
          toast.success("Workspace deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete workspace");
        },
      });
    }
  };

  if (!isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Workspace Settings</CardTitle>
          <CardDescription>
            You do not have permission to modify this workspace.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Update your workspace details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={updateWorkspace.isPending}>
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Deleting a workspace will delete all projects, tasks, and data associated with it.
          </p>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteWorkspace.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
