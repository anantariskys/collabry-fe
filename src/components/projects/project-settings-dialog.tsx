import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpdateProject, useDeleteProject } from "@/hooks/api/use-projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Settings, Trash2 } from "lucide-react";

const updateProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type UpdateProjectFormValues = z.infer<typeof updateProjectSchema>;

interface ProjectSettingsDialogProps {
  project: {
    id: string;
    name: string;
    description?: string;
    workspaceId: string;
  };
}

export function ProjectSettingsDialog({ project }: ProjectSettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const form = useForm<UpdateProjectFormValues>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name,
      description: project.description || "",
    },
  });

  const onSubmit = (data: UpdateProjectFormValues) => {
    updateProject.mutate(
      { id: project.id, data },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Project updated successfully");
        },
        onError: () => {
          toast.error("Failed to update project");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProject.mutate(project.id, {
        onSuccess: () => {
          setOpen(false);
          router.push(`/workspaces/${project.workspaceId}`);
          toast.success("Project deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete project");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Update your project details or delete it.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteProject.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </Button>
              <Button type="submit" disabled={updateProject.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
