import { useActivityLogs } from "@/hooks/api/use-activity-logs";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface ActivityLogListProps {
  workspaceId?: string;
  userId?: string;
  entityType?: string;
}

export function ActivityLogList({ workspaceId, userId, entityType }: ActivityLogListProps) {
  const { data, isLoading } = useActivityLogs({
    workspaceId,
    userId,
    entityType,
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const logs = data?.items || [];

  if (logs.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground text-sm">
        No activity found.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] w-full pr-4">
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-4 text-sm">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={`https://avatar.vercel.sh/${log.user.email}`} />
              <AvatarFallback>{log.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="leading-none">
                <span className="font-medium">{log.user.name}</span>{" "}
                <span className="text-muted-foreground">
                  {formatAction(log.action, log.entityType)}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function formatAction(action: string, entityType: string) {
  const actionMap: Record<string, string> = {
    CREATE: "created",
    UPDATE: "updated",
    DELETE: "deleted",
    ARCHIVE: "archived",
    RESTORE: "restored",
  };

  const entityMap: Record<string, string> = {
    TASK: "task",
    PROJECT: "project",
    WORKSPACE: "workspace",
    COMMENT: "comment",
    ATTACHMENT: "attachment",
  };

  const actionText = actionMap[action] || action.toLowerCase();
  const entityText = entityMap[entityType] || entityType.toLowerCase();

  return `${actionText} ${entityText}`;
}
