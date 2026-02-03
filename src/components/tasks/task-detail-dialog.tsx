"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Send, Paperclip, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/types";
import { useComments, useCreateComment } from "@/hooks/api/use-comments";
import { useAttachments, useCreateAttachment, useDeleteAttachment } from "@/hooks/api/use-attachments";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

interface TaskDetailDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
}: TaskDetailDialogProps) {
  const { data: session } = useSession();
  const [commentContent, setCommentContent] = useState("");
  
  // Attachments state (simple URL input for now)
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [isAddingAttachment, setIsAddingAttachment] = useState(false);

  const { data: comments, isLoading: isLoadingComments } = useComments(task.id);
  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment();

  const { data: attachments, isLoading: isLoadingAttachments } = useAttachments(task.id);
  const { mutate: createAttachment, isPending: isCreatingAttachment } = useCreateAttachment();
  const { mutate: deleteAttachment } = useDeleteAttachment();

  const handleCreateComment = () => {
    if (!commentContent.trim()) return;

    createComment(
      { content: commentContent, taskId: task.id },
      {
        onSuccess: () => {
          setCommentContent("");
        },
      }
    );
  };

  const handleAddAttachment = () => {
    if (!attachmentUrl.trim()) return;

    // Mocking file details since we only input URL
    const filename = attachmentUrl.split("/").pop() || "unknown-file";
    
    createAttachment(
      {
        taskId: task.id,
        url: attachmentUrl,
        filename: filename,
        mimeType: "application/octet-stream", // Default
        size: 0, // Default
      },
      {
        onSuccess: () => {
          setAttachmentUrl("");
          setIsAddingAttachment(false);
          toast.success("Attachment added");
        },
        onError: () => {
          toast.error("Failed to add attachment");
        }
      }
    );
  };

  const handleDeleteAttachment = (id: string) => {
    if (confirm("Delete this attachment?")) {
      deleteAttachment(id, {
        onSuccess: () => toast.success("Attachment deleted"),
        onError: () => toast.error("Failed to delete attachment"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between mr-8">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
            <div className="flex space-x-2">
              <Badge>{task.status.replace("_", " ")}</Badge>
              <Badge variant={task.priority === "HIGH" ? "destructive" : "secondary"}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
          <div className="col-span-2 flex flex-col space-y-6 overflow-y-auto pr-2">
            <div>
              <h3 className="mb-2 font-semibold">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            </div>

            <Separator />

            <div className="flex-1 flex flex-col min-h-0">
              <h3 className="mb-4 font-semibold">Comments</h3>
              <ScrollArea className="flex-1 min-h-[200px] rounded-md border p-4">
                <div className="space-y-4">
                  {isLoadingComments ? (
                    <p className="text-sm text-muted-foreground">Loading comments...</p>
                  ) : comments?.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                  ) : (
                    comments?.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {comment.user?.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {comment.user?.name || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              <div className="mt-4 flex gap-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <Button
                  size="icon"
                  className="mt-auto"
                  onClick={handleCreateComment}
                  disabled={isCreatingComment || !commentContent.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6 overflow-y-auto pr-2">
            <div className="rounded-lg border p-4 space-y-4">
              <h4 className="font-medium">Details</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground block mb-1">Assignee</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {task.assignee?.name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{task.assignee?.name || "Unassigned"}</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Due Date</span>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {task.dueDate
                        ? format(new Date(task.dueDate), "MMM d, yyyy")
                        : "No due date"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Attachments</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setIsAddingAttachment(!isAddingAttachment)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {isAddingAttachment && (
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-xs">File URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="url" 
                      value={attachmentUrl} 
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      placeholder="https://..."
                      className="h-8 text-xs"
                    />
                    <Button 
                      size="sm" 
                      className="h-8"
                      onClick={handleAddAttachment}
                      disabled={isCreatingAttachment}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {isLoadingAttachments ? (
                  <Skeleton className="h-10 w-full" />
                ) : attachments?.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No attachments.</p>
                ) : (
                  attachments?.map((att) => (
                    <div key={att.id} className="flex items-center justify-between rounded-md border p-2 text-sm group">
                      <a 
                        href={att.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 truncate hover:underline"
                      >
                        <Paperclip className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate max-w-[120px]">{att.filename}</span>
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteAttachment(att.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Icon helper
function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
