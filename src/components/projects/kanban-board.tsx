"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Task, TaskStatus } from "@/types";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { useUpdateTask } from "@/hooks/api/use-tasks";
import { toast } from "sonner";

interface KanbanBoardProps {
  projectId: string;
  tasks: Task[];
  isLoading: boolean;
  onTaskClick: (task: Task) => void;
}

const columns: { id: TaskStatus; title: string }[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

export function KanbanBoard({
  projectId,
  tasks: initialTasks,
  isLoading,
  onTaskClick,
}: KanbanBoardProps) {
  // Use local state for optimistic updates
  // In a real app with React Query, we might rely on query cache, 
  // but for smooth DnD we often need local state or setQueryData
  // Since we are receiving tasks as props, we might want to sync them
  // For simplicity, I'll rely on the props for the source of truth, 
  // but I'll implement onDragEnd to call the mutation.
  // Actually, for DnD to be smooth, we usually need to reflect changes immediately.
  
  // However, if `tasks` comes from useQuery, it will update when we invalidate queries.
  // Let's see if we can just trigger the mutation.

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const { mutate: updateTask } = useUpdateTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requires 8px movement to start drag (prevents accidental drags on click)
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If dropped over a column (which has the status as ID)
    const activeTask = initialTasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if dropped directly on a column container
    if (columns.some((col) => col.id === overId)) {
        if (activeTask.status !== overId) {
            updateTask(
                { id: activeTask.id, data: { status: overId as TaskStatus } },
                {
                    onError: () => {
                        toast.error("Failed to update task status");
                    },
                }
            );
        }
        return;
    }

    // Check if dropped on another task
    const overTask = initialTasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
        updateTask(
            { id: activeTask.id, data: { status: overTask.status } },
            {
                onError: () => {
                    toast.error("Failed to update task status");
                },
            }
        );
    }
  }

  function onDragOver(event: DragOverEvent) {
    // This is mainly for visual sorting feedback if we had sorting implemented
    // For now, we just want to allow dropping.
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="grid h-full w-full min-w-[1000px] grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            projectId={projectId}
            tasks={initialTasks?.filter((t) => t.status === column.id) || []}
            isLoading={isLoading}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeTask && (
              <KanbanCard task={activeTask} onClick={() => {}} />
            )}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}
