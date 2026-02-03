"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KanbanCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function KanbanCard({ task, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="cursor-grab border-transparent shadow-sm hover:border-border transition-all duration-200 group active:cursor-grabbing"
        onClick={() => onClick(task)}
      >
        <CardHeader className="p-4 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
              {task.title}
            </CardTitle>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Badge variant="outline" className="text-[10px] font-normal h-5 px-1.5">
              {task.priority}
            </Badge>
            {task.dueDate && (
              <span className="text-[10px]">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
