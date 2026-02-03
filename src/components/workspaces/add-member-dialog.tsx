"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addMemberSchema,
  AddMemberValues,
} from "@/lib/validations/workspace";
import { useAddWorkspaceMember } from "@/hooks/api/use-workspaces";
import { userService } from "@/services/user.service";

interface AddMemberDialogProps {
  workspaceId: string;
}

export function AddMemberDialog({ workspaceId }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { mutate: addMember, isPending } = useAddWorkspaceMember();

  const form = useForm<AddMemberValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  async function onSubmit(values: AddMemberValues) {
    try {
      setIsSearching(true);
      const response = await userService.getUsers({ search: values.email });
      const user = response.items.find((u) => u.email === values.email);

      if (!user) {
        toast.error("User not found with this email");
        setIsSearching(false);
        return;
      }

      addMember(
        { workspaceId, data: { userId: user.id, role: values.role } },
        {
          onSuccess: () => {
            setOpen(false);
            form.reset();
            toast.success("Member added successfully");
            setIsSearching(false);
          },
          onError: () => {
            toast.error("Failed to add member");
            setIsSearching(false);
          },
        }
      );
    } catch (error) {
      toast.error("Error searching for user");
      setIsSearching(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Invite a new member to this workspace.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="member@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending || isSearching}>
                {isPending || isSearching ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
