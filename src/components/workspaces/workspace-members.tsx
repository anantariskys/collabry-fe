"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceMembers, useRemoveWorkspaceMember } from "@/hooks/api/use-workspaces";
import { AddMemberDialog } from "@/components/workspaces/add-member-dialog";

interface WorkspaceMembersProps {
  workspaceId: string;
}

export function WorkspaceMembers({ workspaceId }: WorkspaceMembersProps) {
  const { data: members, isLoading } = useWorkspaceMembers(workspaceId);
  const { mutate: removeMember, isPending: isRemoving } = useRemoveWorkspaceMember();

  const handleRemoveMember = (userId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      removeMember(
        { workspaceId, userId },
        {
          onSuccess: () => {
            toast.success("Member removed successfully");
          },
          onError: () => {
            toast.error("Failed to remove member");
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Members</h2>
        <AddMemberDialog workspaceId={workspaceId} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {member.user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{member.user?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {member.user?.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{member.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.userId)}
                    disabled={isRemoving}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {members?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
