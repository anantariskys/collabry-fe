"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskStatus, Task } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { KanbanCard } from "./kanban-card";
import { Skeleton } from "@/components/ui/skeleton";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  projectId: string;
  isLoading?: boolean;
  onTaskClick: (task: Task) => void;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  projectId,
  isLoading,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex h-full flex-col rounded-xl border bg-muted/30 p-4">
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        <Badge
          variant="outline"
          className="bg-background font-normal text-muted-foreground"
        >
          {tasks.length}
        </Badge>
      </div>

      <div ref={setNodeRef} className="flex-1 space-y-3 overflow-y-auto pr-2 min-h-[150px]">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))
        ) : (
          <SortableContext
            items={tasks.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <KanbanCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </SortableContext>
        )}
      </div>

      <div className="mt-4 pt-2">
        <CreateTaskDialog projectId={projectId} defaultStatus={id} />
      </div>
    </div>
  );
}
